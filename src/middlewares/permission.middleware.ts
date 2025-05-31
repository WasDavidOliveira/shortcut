import { Request, Response, NextFunction } from 'express';
import { db } from '@/db/db.connection';
import { user } from '@/db/schema/v1/user.schema';
import { permissions } from '@/db/schema/v1/permission.schema';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { eq, and, inArray } from 'drizzle-orm';
import { ForbiddenError, UnauthorizedError } from '@/utils/app-error.utils';
import { PermissionAction } from '@/constants/permission.constants';
import { PermissionCheck } from '@/types/permission.types';

export const hasPermission = (
  permissionName: string,
  action: PermissionAction
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    try {
      const userData = await db.query.user.findFirst({
        where: eq(user.id, Number(req.userId)),
      });

      if (!userData) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      const permission = await db.query.permissions.findFirst({
        where: and(
          eq(permissions.name, permissionName),
          eq(permissions.action, action)
        ),
      });

      if (!permission) {
        throw new ForbiddenError(
          `Usuário não tem permissão para realizar esta ação`
        );
      }

      const hasPermission = await db.query.rolePermissions.findFirst({
        where: and(
          eq(rolePermissions.roleId, userData.roleId),
          eq(rolePermissions.permissionId, permission.id)
        ),
      });

      if (!hasPermission) {
        throw new ForbiddenError(
          'Usuário não tem permissão para realizar esta ação'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const hasAllPermissions = (permissionChecks: PermissionCheck[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    try {
      const userData = await db.query.user.findFirst({
        where: eq(user.id, Number(req.userId)),
        with: {
          role: true,
        },
      });

      if (!userData) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      for (const { name, action } of permissionChecks) {
        const permission = await db.query.permissions.findFirst({
          where: and(
            eq(permissions.name, name),
            eq(permissions.action, action)
          ),
        });

        if (!permission) {
          throw new ForbiddenError(
            `Permissão ${name}:${action} não encontrada`
          );
        }

        const hasPermission = await db.query.rolePermissions.findFirst({
          where: and(
            eq(rolePermissions.roleId, userData.roleId),
            eq(rolePermissions.permissionId, permission.id)
          ),
        });

        if (!hasPermission) {
          throw new ForbiddenError(
            `Usuário não tem a permissão ${name}:${action}`
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const hasAnyPermission = (permissionChecks: PermissionCheck[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    try {
      const userData = await db.query.user.findFirst({
        where: eq(user.id, Number(req.userId)),
        with: {
          role: true,
        },
      });

      if (!userData) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      const permissionNames = permissionChecks.map((p) => p.name);
      const permissionActions = permissionChecks.map((p) => p.action);

      const permissionList = await db.query.permissions.findMany({
        where: and(
          inArray(permissions.name, permissionNames),
          inArray(permissions.action, permissionActions)
        ),
      });

      if (permissionList.length === 0) {
        throw new ForbiddenError(
          'Nenhuma das permissões especificadas foi encontrada'
        );
      }

      const permissionIds = permissionList.map((p) => p.id);
      const userRolePermissions = await db.query.rolePermissions.findMany({
        where: and(
          eq(rolePermissions.roleId, userData.roleId),
          inArray(rolePermissions.permissionId, permissionIds)
        ),
      });

      if (userRolePermissions.length === 0) {
        throw new ForbiddenError(
          'Usuário não tem nenhuma das permissões necessárias'
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
