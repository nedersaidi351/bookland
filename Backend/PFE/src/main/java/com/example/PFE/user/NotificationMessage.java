package com.example.PFE.user;

public class NotificationMessage {
    private String content;
    private String recipientEmail;

    public NotificationMessage() {
    }

    public NotificationMessage(String content, String recipientEmail) {
        this.content = content;
        this.recipientEmail = recipientEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }
}
