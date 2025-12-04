export interface UserUpdateRequest {
  firstname?: string;
  lastname?: string;
  active?: boolean;
  roles?: string[]; // or Role[]
}