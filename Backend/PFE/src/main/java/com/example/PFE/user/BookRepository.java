package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    @Query("SELECT new com.example.PFE.user.BookDTO(b.id, b.title, b.author, b.description, b.price, b.isbn, b.pdfFilePath,b.coverImageContentType, b.uploadDate) FROM Book b")
    List<BookDTO> findAllBooksAsDTO();
    // Add this method to your BookRepository
    List<Book> findByGenresName(String genreName);
    @Query("SELECT DISTINCT b.genres FROM Book b")
    List<String> findDistinctGenres();

}
