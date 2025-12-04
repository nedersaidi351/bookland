export interface Post {
  id: number;
  likeCount: number;
  title:string;
  content: string;
  authorName: string;
  createdAt: string;
  likedByCurrentUser?: boolean;
  likedByEmails: string[];
  email:string;
  userImageBase64?: string; // new field

  }
  