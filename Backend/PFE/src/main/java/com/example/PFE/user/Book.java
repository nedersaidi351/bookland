package com.example.PFE.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Author is required")
    @Column(nullable = false)
    private String author;

    private String description;

    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal price;

    @NotBlank(message = "ISBN is required")
    @Column(unique = true, nullable = false)
    private String isbn;

    // Store image as BLOB in database
    @Lob
    @Column(name = "cover_image", columnDefinition = "LONGBLOB")
    @JsonIgnore // Don't include in JSON serialization
    private byte[] coverImage;

    // Store content type for proper rendering
    @Column(name = "cover_image_content_type")
    private String coverImageContentType;

    // Keep PDF in file system
    @NotBlank(message = "PDF file path is required")
    @Column(nullable = false)
    private String pdfFilePath;
    @ManyToOne
    private User user;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime uploadDate;
    @ManyToMany
    @JoinTable(
            name = "book_genre",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "genre_id")
    )
    private Set<Genre> genres = new HashSet<>();

    // Helper method to check if image exists
    public boolean hasCoverImage() {
        return this.coverImage != null && this.coverImage.length > 0;
    }

    public static BookBuilder builder() {
        return new BookBuilder();
    }

    public static class BookBuilder {
        private Long id;
        private String title;
        private String author;
        private String description;
        private BigDecimal price;
        private String isbn;
        private byte[] coverImage;
        private String coverImageContentType;
        private String pdfFilePath;
        private LocalDateTime uploadDate;


        public BookBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public BookBuilder title(String title) {
            this.title = title;
            return this;
        }

        public BookBuilder author(String author) {
            this.author = author;
            return this;
        }

        public BookBuilder description(String description) {
            this.description = description;
            return this;
        }

        public BookBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public BookBuilder isbn(String isbn) {
            this.isbn = isbn;
            return this;
        }

        public BookBuilder coverImage(byte[] coverImage) {
            this.coverImage = coverImage;
            return this;
        }

        public BookBuilder coverImageContentType(String contentType) {
            this.coverImageContentType = contentType;
            return this;
        }

        public BookBuilder pdfFilePath(String pdfFilePath) {
            this.pdfFilePath = pdfFilePath;
            return this;
        }

        public BookBuilder uploadDate(LocalDateTime uploadDate) {
            this.uploadDate = uploadDate;
            return this;
        }

        public Book build() {
            Book book = new Book();
            book.setId(id);
            book.setTitle(title);
            book.setAuthor(author);
            book.setDescription(description);
            book.setPrice(price);
            book.setIsbn(isbn);
            book.setCoverImage(coverImage);
            book.setCoverImageContentType(coverImageContentType);
            book.setPdfFilePath(pdfFilePath);
            book.setUploadDate(uploadDate);
            return book;
        }
    }
}