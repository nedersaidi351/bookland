export interface Book {
  id?: number;
  title: string;
  author: string;
  description?: string;
  price: number;
  isbn: string;
  coverImagePath?: string;  // Changed from coverImageUrl
  pdfFilePath?: string;     // Changed from pdfUrl
  uploadDate?: Date;
  isPurchased?: boolean;  
  genres: string[];

  
}