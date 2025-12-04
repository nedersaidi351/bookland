package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();

    Optional<Object> findById(Integer id);

    List<Post> findByUserId(Integer id);
    void deleteByUser(User user);


}

