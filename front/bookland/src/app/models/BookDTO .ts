// src/app/models/Book.ts
export interface BookDTO {
  id?: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  isbn: string;
  coverImagePath?: string;  // The path stored in database
  pdfFilePath?: string;     // The path stored in database
  uploadDate?: Date;
   genres: string[];
  coverImageUrl?: string;   // Will be generated in component
  pdfUrl?: string;          // Will be generated in component
  isPurchased?: boolean; 
}