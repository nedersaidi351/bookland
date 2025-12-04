package com.example.PFE.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookService {

    private final BookRepository bookRepository;
    private final FileStorageService fileStorageService;
    private final PurchaseRepository purchaseRepository;
    private final GenreRepository genreRepository;
    private final UserRepository userRepository;

    public BookDTO createBook(BookDTO bookDTO, MultipartFile coverImage, MultipartFile pdfFile) throws IOException {
        // Validate files
        if (coverImage == null || coverImage.isEmpty() || pdfFile == null || pdfFile.isEmpty()) {
            throw new IllegalArgumentException("Cover image and PDF file cannot be empty");
        }

        // Store PDF
        String pdfFilePath = fileStorageService.storeFile(pdfFile);

        // Create Book entity
        Book book = new Book();
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setDescription(bookDTO.getDescription());
        book.setPrice(bookDTO.getPrice());
        book.setIsbn(bookDTO.getIsbn());

        // Handle genres
        Set<Genre> genres = new HashSet<>();
        if (bookDTO.getGenres() != null) {
            for (String genreName : bookDTO.getGenres()) {
                Genre genre = genreRepository.findByName(genreName)
                        .orElseGet(() -> genreRepository.save(new Genre(null, genreName)));
                genres.add(genre);
            }
        }
        book.setGenres(genres);

        // Store cover image
        book.setCoverImage(coverImage.getBytes());
        book.setCoverImageContentType(coverImage.getContentType());

        book.setPdfFilePath(pdfFilePath);
        book.setUploadDate(LocalDateTime.now());

        Book savedBook = bookRepository.save(book);
        return convertToDTO(savedBook);
    }

    public List<BookDTO> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<BookDTO> getBooksByGenre(String genreName) {
        return bookRepository.findByGenresName(genreName).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<BookDTO> getBookById(Long id) {
        return bookRepository.findById(id)
                .map(this::convertToDTO);
    }

    private BookDTO convertToDTO(Book book) {
        return BookDTO.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .description(book.getDescription())
                .price(book.getPrice())
                .isbn(book.getIsbn())
                .pdfFilePath("/api/files/" + book.getPdfFilePath())
                .uploadDate(book.getUploadDate())
                .coverImageContentType(book.getCoverImageContentType())
                .genres(book.getGenres().stream()
                        .map(Genre::getName)
                        .collect(Collectors.toSet()))
                .build();
    }

    public byte[] getBookCoverImage(Long bookId) {
        return bookRepository.findById(bookId)
                .map(Book::getCoverImage)
                .orElseThrow(() -> new RuntimeException("Book not found"));
    }

    public List<String> getAllGenres() {
        return genreRepository.findAll()
                .stream()
                .map(Genre::getName)
                .toList();
    }
    // Add these methods to your BookService
    public BookDTO updateBook(Long id, BookDTO bookDTO) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setDescription(bookDTO.getDescription());
        book.setPrice(bookDTO.getPrice());
        book.setIsbn(bookDTO.getIsbn());

        // Handle genres update if needed
        if (bookDTO.getGenres() != null) {
            Set<Genre> genres = new HashSet<>();
            for (String genreName : bookDTO.getGenres()) {
                Genre genre = genreRepository.findByName(genreName)
                        .orElseGet(() -> genreRepository.save(new Genre(null, genreName)));
                genres.add(genre);
            }
            book.setGenres(genres);
        }

        Book updatedBook = bookRepository.save(book);
        return convertToDTO(updatedBook);
    }

    public void deleteBook(Long id) {
        // First, delete associated purchases
        purchaseRepository.deleteByBookId(id);

        // Then delete the book
        bookRepository.deleteById(id);
    }



}
