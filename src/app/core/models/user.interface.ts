export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  password: string;
  passwordConfirm?: string;
  birthDate: string;
  role: 'admin' | 'doctor' | 'patient';
}
