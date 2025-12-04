package com.example.PFE.user;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public PurchaseController(PurchaseRepository purchaseRepository,
                              UserRepository userRepository,
                              BookRepository bookRepository) {
        this.purchaseRepository = purchaseRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @PostMapping
    public ResponseEntity<?> createPurchase(@RequestBody PurchaseRequest request) {
        try {
            User user = userRepository.findByEmail(request.getUserEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Book book = bookRepository.findById(request.getBookId())
                    .orElseThrow(() -> new RuntimeException("Book not found"));

            Purchase purchase = new Purchase(user, book);
            purchaseRepository.save(purchase);

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/user")
    public ResponseEntity<List<BookDTO>> getPurchasedBooks(
            @RequestParam String email) {
        try {
            if (!userRepository.existsByEmail(email)) {
                return ResponseEntity.notFound().build();
            }

            List<Purchase> purchases = purchaseRepository.findByUserEmail(email);
            List<BookDTO> books = purchases.stream()
                    .map(Purchase::getBook)
                    .map(this::convertToDto)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(books);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkIfPurchased(
            @RequestParam String email,
            @RequestParam Long bookId) {
        try {
            boolean exists = purchaseRepository.existsByUserEmailAndBookId(email, bookId);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    private BookDTO convertToDto(Book book) {
        BookDTO dto = new BookDTO();
        dto.setId(book.getId());
        dto.setTitle(book.getTitle());
        dto.setAuthor(book.getAuthor());
        dto.setPdfFilePath(book.getPdfFilePath());
        dto.setPrice(book.getPrice());
        dto.setCoverImageContentType(book.getCoverImageContentType());
        return dto;
    }
    @GetMapping("/count")
    public ResponseEntity<Long> getPurchaseCountByUserId(@RequestParam Long userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            long count = purchaseRepository.countByUserEmail(user.getEmail());
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

}
