package com.example.PFE.user;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    // You can add custom query methods here if needed
   List<Purchase> findByUserEmail(String email);
    boolean existsByUserAndBook(User user, Book book);
    boolean existsByUserEmailAndBookId(String email, Long bookId);
    long countByUserEmail(String email);
    @Modifying
    @Transactional
    @Query("DELETE FROM Purchase p WHERE p.book.id = :bookId")
    void deleteByBookId(Long bookId);
}
