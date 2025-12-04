package com.example.PFE.user;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:4200")
public class BookController {
    @Autowired
    private BookRepository bookRepository;
    private final BookService bookService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private GenreRepository genreRepository;
    @Autowired
    private PurchaseRepository purchaseRepository;


    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createBook(
            @RequestPart("book") String bookJson,
            @RequestPart("coverImage") MultipartFile coverImage,
            @RequestPart("pdfFile") MultipartFile pdfFile) {



        try {
            ObjectMapper objectMapper = new ObjectMapper();
            BookDTO bookDTO = objectMapper.readValue(bookJson, BookDTO.class);

            // Validate required fields
            if (bookDTO.getTitle() == null || bookDTO.getTitle().isEmpty()) {
                throw new IllegalArgumentException("Title is required");
            }

            BookDTO createdBook = bookService.createBook(bookDTO, coverImage, pdfFile);
            return ResponseEntity.ok(createdBook);
        } catch (JsonProcessingException e) {

            return ResponseEntity.badRequest().body("Invalid book data format");
        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {

            return ResponseEntity.internalServerError().body("Failed to create book");
        }
    }

    @GetMapping
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        try {
            List<BookDTO> books = bookService.getAllBooks();
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookDTO> getBookById(@PathVariable Long id) {
        try {
            return bookService.getBookById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace(); // or use a logger
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/{id}/cover")
    public ResponseEntity<byte[]> getCoverImage(@PathVariable Long id) {
        try {
            Optional<BookDTO> bookOptional = bookService.getBookById(id);
            if (bookOptional.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            byte[] imageData = bookService.getBookCoverImage(id);
            if (imageData == null || imageData.length == 0) {
                return ResponseEntity.notFound().build();
            }

            BookDTO book = bookOptional.get();
            MediaType contentType = MediaType.IMAGE_JPEG; // default
            if (book.getCoverImageContentType() != null) {
                contentType = MediaType.parseMediaType(book.getCoverImageContentType());
            }

            return ResponseEntity.ok()
                    .contentType(contentType)
                    .header("Cache-Control", "public, max-age=604800")
                    .body(imageData);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/genre/{genre}")
    public ResponseEntity<List<BookDTO>> getBooksByGenre(@PathVariable String genre) {
        try {
            List<BookDTO> books = bookService.getBooksByGenre(genre);
            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Add endpoint to get all genres
    @GetMapping("/genres")
    public ResponseEntity<List<String>> getAllGenres() {
        try {
            List<String> genres = bookService.getAllGenres();
            return ResponseEntity.ok(genres);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/addgenre")
    public ResponseEntity<String> addGenre(@RequestBody Map<String, String> request) {
        String genreName = request.get("name");
        if (genreName == null || genreName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Genre name is required");
        }

        if (genreRepository.findByName(genreName).isPresent()) {
            return ResponseEntity.badRequest().body("Genre already exists");
        }

        Genre genre = new Genre();
        genre.setName(genreName);
        genreRepository.save(genre);

        return ResponseEntity.ok("Genre added successfully");
    }
    @PutMapping("/{id}")
    public ResponseEntity<BookDTO> updateBook(
            @PathVariable Long id,
            @RequestBody BookDTO bookDTO) {
        BookDTO updatedBook = bookService.updateBook(id, bookDTO);
        return ResponseEntity.ok(updatedBook);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable Long id) {
        try {
            if (!bookRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Book not found");
            }

            purchaseRepository.deleteByBookId(id); // Must exist and work
            bookService.deleteBook(id);

            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace(); // Print full error
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }






}

