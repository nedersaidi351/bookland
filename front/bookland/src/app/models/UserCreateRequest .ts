export interface UserCreateRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confpassword: string;
  roles?: string[]; // or Role[]
}