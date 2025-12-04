package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Changed method name to match new field name
    List<Notification> findByRecipientEmailAndIsReadFalse(String recipientEmail);
}