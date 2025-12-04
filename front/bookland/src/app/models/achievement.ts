import { User } from "./user";

export interface achievement{
     iconUrl: string;
      user: User; // or whatever your User type is
  name: string;
  description: string;
}