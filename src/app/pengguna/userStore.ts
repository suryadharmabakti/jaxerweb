import { readJson, writeJson } from '@/services/localStore';

export type Role = 'admin' | 'cashier' | 'warehouse';

export type UserRow = {
  id: string;
  name: string;
  email: string;
  branch: string;
  role: Role;
};

export const BRANCHES = ['Pusat', 'Cabang Jakarta', 'Cabang Surabaya', 'Cabang Bogor'] as const;

export const USER_STORAGE_KEY = 'jaxerweb_users';

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin',
  cashier: 'Kasir',
  warehouse: 'Gudang',
};

export const DEFAULT_USERS: UserRow[] = [
  {
    id: '1',
    name: 'Ahmad Ashidiq',
    email: 'ahmadasshidiq08@gmail.com',
    branch: 'Pusat',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Rudi Malik',
    email: 'rudimalik@gmail.com',
    branch: 'Cabang Jakarta',
    role: 'cashier',
  },
  {
    id: '3',
    name: 'Suparman',
    email: 'suparman38@gmail.com',
    branch: 'Cabang Jakarta',
    role: 'warehouse',
  },
  {
    id: '4',
    name: 'Ayu Fadilah',
    email: 'ayu7788@gmail.com',
    branch: 'Cabang Surabaya',
    role: 'warehouse',
  },
  {
    id: '5',
    name: 'Marwah',
    email: 'marwan56@gmail.com',
    branch: 'Cabang Bogor',
    role: 'warehouse',
  },
];

export function loadUsers(): UserRow[] {
  return readJson<UserRow[]>(USER_STORAGE_KEY, DEFAULT_USERS);
}

export function saveUsers(users: UserRow[]): void {
  writeJson(USER_STORAGE_KEY, users);
}
