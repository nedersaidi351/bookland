package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {
    boolean existsByPostIdAndUserEmail(Long postId, String email);

    boolean existsByPostAndUser(Post post, User user);
}

