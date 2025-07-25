export interface Firma {
  id?: number;
  nombre: string;
  apellido: string;
  cargo: string;
  departamento: string;
  telefono?: string;
  celular?: string;
  email: string;
  created_at?: Date;
}