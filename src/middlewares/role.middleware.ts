import { Request, Response, NextFunction } from 'express';
import { db } from '@/db/db.connection';
import { user } from '@/db/schema/v1/user.schema';
import { eq } from 'drizzle-orm';
import { ForbiddenError, UnauthorizedError } from '@/utils/app-error.utils';
import { UserWithRole } from '@/types/middlewares.types';

export const hasRole = (roleName: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedError('Usuário não autenticado.');
    }

    try {
      const userData = (await db.query.user.findFirst({
        where: eq(user.id, Number(req.userId)),
        with: {
          role: true,
        },
      })) as UserWithRole | null;

      if (!userData) {
        throw new UnauthorizedError('Usuário não encontrado.');
      }

      if (!userData.role || userData.role.name !== roleName) {
        throw new ForbiddenError('Você não possui acesso a este recurso.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const hasAnyRole = (roleNames: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.userId) {
      throw new UnauthorizedError('Usuário não autenticado');
    }

    try {
      const userData = (await db.query.user.findFirst({
        where: eq(user.id, Number(req.userId)),
        with: {
          role: true,
        },
      })) as UserWithRole | null;

      if (!userData) {
        throw new UnauthorizedError('Usuário não encontrado');
      }

      if (!userData.role || !roleNames.includes(userData.role.name)) {
        throw new ForbiddenError('Você não possui acesso a este recurso.');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
