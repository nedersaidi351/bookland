package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findBySenderAndRecipientOrRecipientAndSenderOrderByTimestampAsc(
            String sender, String recipient, String recipient2, String sender2);
}