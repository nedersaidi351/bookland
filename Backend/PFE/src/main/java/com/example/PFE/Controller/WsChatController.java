package com.example.PFE.Controller;

import com.example.PFE.user.ChatMessage;
import com.example.PFE.user.ChatMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;

@Controller
public class WsChatController {

    @Autowired
    private ChatMessageRepository messageRepository;

    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public ChatMessage sendMessage(@Payload ChatMessage message) {
        message.setTimestamp(LocalDateTime.now().toString());
        return messageRepository.save(message); // Save & broadcast
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/chat")
    public ChatMessage addUser(@Payload ChatMessage message, SimpMessageHeaderAccessor headerAccessor) {
        headerAccessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }

    @MessageMapping("/chat.typing")
    @SendTo("/topic/typing")
    public TypingStatus handleTyping(@Payload TypingStatus typingStatus) {
        return typingStatus;
    }

    // Simple class to hold typing data
    public static class TypingStatus {
        private String sender;
        private boolean typing;

        public String getSender() { return sender; }
        public void setSender(String sender) { this.sender = sender; }
        public boolean isTyping() { return typing; }
        public void setTyping(boolean typing) { this.typing = typing; }
    }
}
