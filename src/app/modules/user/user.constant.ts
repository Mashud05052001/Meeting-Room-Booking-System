export const userRolesArray = ['user', 'admin'];

export const userRoles = {
  user: 'user',
  admin: 'admin',
} as const;

export type TUserRoles = keyof typeof userRoles;
