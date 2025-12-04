import { User } from "./user";

export interface PaginatedUsers {
  content: User[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}