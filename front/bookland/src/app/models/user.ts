export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password:string;
  confpassword:string;
  mfaEnabled?: boolean;
  imageUrl?: string; // You might want to handle images differently in frontend
  createdAt?: string | Date;
  lastLogin?: string | Date;
  // Add any other fields you need from the backend
}
