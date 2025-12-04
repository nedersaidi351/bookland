package com.example.PFE.user;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.Base64;

@Data
public class PostDTO {
    private  int likeCount;
    private Long id;
    private String email;
    private String userImageBase64;
    private String content;
    private String authorName;
    private LocalDateTime createdAt;

    public PostDTO(Post post) {
        this.id = post.getId();
        this.content = post.getContent();
        this.likeCount = post.getLikeCount();
        this.createdAt = post.getCreatedAt();

        if (post.getUser() != null) {
            this.email = post.getUser().getEmail();
            this.authorName = (post.getUser().getFirstname() != null ? post.getUser().getFirstname() : "") + " "
                    + (post.getUser().getLastname() != null ? post.getUser().getLastname() : "");
            this.authorName = this.authorName.trim();

            byte[] imageBytes = post.getUser().getImage();
            if (imageBytes != null) {
                this.userImageBase64 = Base64.getEncoder().encodeToString(imageBytes);
            }
        } else {
            this.authorName = "Anonymous";
        }
    }


    public PostDTO() {

    }

    public String getUserImageBase64() {
        return userImageBase64;
    }

    public void setUserImageBase64(String userImageBase64) {
        this.userImageBase64 = userImageBase64;
    }

    public int getLikeCount() {
        return likeCount;
    }

    public void setLikeCount(int likeCount) {
        this.likeCount = likeCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthorName() {
        return authorName;
    }

    public void setAuthorName(String authorName) {
        this.authorName = authorName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
