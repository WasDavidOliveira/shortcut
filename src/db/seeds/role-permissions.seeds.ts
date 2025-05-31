import { db } from '@/db/db.connection';
import { roles } from '@/db/schema/v1/role.schema';
import { rolePermissions } from '@/db/schema/v1/role-permission.schema';
import { eq } from 'drizzle-orm';
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

    const permissionMap = allPermissions.reduce(
      (map, permission) => {
        map[permission.name] = permission.id;
        return map;
      },
      {} as Record<string, number>
    );

    const adminPermissions = allPermissions.map((permission) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
    }));

    const userPermissions = [
      { roleId: userRole.id, permissionId: permissionMap['read_users'] },
      { roleId: userRole.id, permissionId: permissionMap['update_user'] },
      { roleId: userRole.id, permissionId: permissionMap['read_roles'] },
    ];

    const guestPermissions = [
      { roleId: guestRole.id, permissionId: permissionMap['read_users'] },
    ];

    const allRolePermissions = [
      ...adminPermissions,
      ...userPermissions,
      ...guestPermissions,
    ];

    for (const rolePermission of allRolePermissions) {
      await db
        .insert(rolePermissions)
        .values(rolePermission)
        .onConflictDoNothing();
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
