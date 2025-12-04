package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    @Autowired
    private ChatMessageRepository messageRepository;

    @GetMapping("/history")
    public List<ChatMessage> getAllMessages() {
        return messageRepository.findAll(); // Group chat: return all messages
    }

    // Delete single message by ID
    @DeleteMapping("/message/{id}")
    public ResponseEntity<?> deleteMessage(@PathVariable Long id) {
        return messageRepository.findById(id)
                .map(message -> {
                    messageRepository.delete(message);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete all messages (optional)
    @DeleteMapping("/clear")
    public ResponseEntity<?> clearAllMessages() {
        messageRepository.deleteAll();
        return ResponseEntity.ok().build();
    }
}