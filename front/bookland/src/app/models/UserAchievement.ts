import { User } from "./user";

export interface UserAchievement {
  id?: number;
  earned_at?: Date;
  achievement_id?: number;
   name: string;
  description: string;
  
  user_id?: number;
  iconUrl: string; 

  achievement?: {
  id?: number;
  name: string;
  description: string;
  tier: string;  // Make sure this exists
  iconUrl: string;
  };
}
