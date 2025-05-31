export type UserWithRole = {
  id: number;
  roleId: number;
  role: {
    id: number;
    name: string;
    description: string;
  };
};
