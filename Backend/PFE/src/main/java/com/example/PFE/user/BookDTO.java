package com.example.PFE.user;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@Data
@AllArgsConstructor
@Builder
public class BookDTO {
    private Long id;
    private String title;
    private String author;
    private String description;
    // Add to your BookDTO class
    private Set<String> genres;
    @JsonSerialize(using = ToStringSerializer.class)
    private BigDecimal price;
    private String coverImageContentType;

    // Add getter and setter
    private String isbn;

    // Change these to match your entity
   // Changed from coverImageUrl
    private String pdfFilePath;     // Changed from pdfUrl

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime uploadDate;

    public BookDTO(Long id, String title, String author, String description,
                   BigDecimal price, String isbn, String pdfFilePath,
                   String coverImageContentType, LocalDateTime uploadDate) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
        this.price = price;
        this.isbn = isbn;
        this.pdfFilePath = pdfFilePath;
        this.coverImageContentType = coverImageContentType;
        this.uploadDate = uploadDate;
    }
}