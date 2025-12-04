package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @PostMapping("/send")
    public ResponseEntity<?> sendNotification(@RequestBody NotificationRequest request) {
        try {
            Notification notification = new Notification();
            notification.setRecipientEmail(request.getRecipientEmail());
            notification.setContent(request.getContent());
            notification.setRead(false); // This sets isRead=false
            notificationRepository.save(notification);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error sending notification: " + e.getMessage());
        }
    }

    @GetMapping("/unread/{email}")
    public ResponseEntity<List<Notification>> getUnreadNotifications(@PathVariable String email) {
        return ResponseEntity.ok(
                notificationRepository.findByRecipientEmailAndIsReadFalse(email) // Updated method
        );
    }

    @PostMapping("/mark-read/{id}")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id)
                .map(notification -> {
                    notification.setRead(true); // This sets isRead=true
                    notificationRepository.save(notification);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}

// Request DTO

