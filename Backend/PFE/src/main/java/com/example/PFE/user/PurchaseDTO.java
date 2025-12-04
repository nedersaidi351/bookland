package com.example.PFE.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseDTO {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookAuthor;
    private String bookCoverImagePath;
    private Integer userId;
    private String userEmail;
    private LocalDateTime purchaseDate;

    // Additional fields you might want to include:
    private Double price;
    private String transactionId;
    private String paymentMethod;

}