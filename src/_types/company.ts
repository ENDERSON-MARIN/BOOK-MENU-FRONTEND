export interface Company {
  id: string;
  name: string;
  cnpj: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  createdAt: string;
  updatedAt: string;
}
