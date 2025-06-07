import { db } from '@/db/db.connection';
import { roles } from '@/db/schema/v1/role.schema';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { eq, and } from 'drizzle-orm';
import { logger } from '@/utils/logger.utils';

export async function seedRolePermissions() {
  try {
    logger.info('Seeding role permissions...');

    const adminRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'admin'),
    });

    const userRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'user'),
    });

    const guestRole = await db.query.roles.findFirst({
      where: eq(roles.name, 'guest'),
    });

    if (!adminRole || !userRole || !guestRole) {
      throw new Error('Required roles not found. Please run role seeds first.');
    }

    const allPermissions = await db.query.permissions.findMany();
    if (allPermissions.length === 0) {
      throw new Error(
        'No permissions found. Please run permission seeds first.'
      );
    }

    const getPermissionId = (name: string, action: string) => {
      const permission = allPermissions.find(
        (p) => p.name === name && p.action === action
      );
      return permission?.id;
    };

    const adminPermissions = allPermissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    }));

    const userPermissions = [
      { roleId: userRole.id, permissionId: getPermissionId('user', 'read') },
      { roleId: userRole.id, permissionId: getPermissionId('user', 'update') },
      { roleId: userRole.id, permissionId: getPermissionId('role', 'read') },
    ].filter(
      (p): p is { roleId: number; permissionId: number } =>
        p.permissionId !== undefined
    );

    const guestPermissions = [
      { roleId: guestRole.id, permissionId: getPermissionId('user', 'read') },
    ].filter(
      (p): p is { roleId: number; permissionId: number } =>
        p.permissionId !== undefined
    );

    const allRolePermissions = [
      ...adminPermissions,
      ...userPermissions,
      ...guestPermissions,
    ];

    for (const rolePermission of allRolePermissions) {
      const existing = await db
        .select()
        .from(rolePermissions)
        .where(
          and(
            eq(rolePermissions.roleId, rolePermission.roleId),
            eq(rolePermissions.permissionId, rolePermission.permissionId)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(rolePermissions).values(rolePermission);
        logger.info(
          `Atribuição criada: roleId ${rolePermission.roleId} - permissionId ${rolePermission.permissionId}`
        );
      } else {
        logger.info(
          `Atribuição já existe: roleId ${rolePermission.roleId} - permissionId ${rolePermission.permissionId}`
        );
      }
    }

    logger.info('Role permissions seeded successfully');
  } catch (error) {
    logger.error('Error seeding role permissions:', error);
    throw error;
  }
}

if (require.main === module) {
  seedRolePermissions()
    .then(() => process.exit(0))
    .catch((error) => {
      logger.error('Failed to seed role permissions:', error);
      process.exit(1);
    });
}
