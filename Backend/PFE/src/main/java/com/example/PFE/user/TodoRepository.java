package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUserEmail(String email);
    List<Todo> findByUserEmailOrderByGroupName(String email);

    List<String> findDistinctGroupNamesByUserEmail(String email);

    int countByUserEmailAndGroupName(String email, String groupName);

    List<Todo> findByUserEmailAndGroupName(String email, String groupName);

    List<Todo> findByUser(User user);
    @Query("SELECT t FROM Todo t WHERE t.id = :id AND t.user.email = :email")
    Optional<Todo> findByIdAndUserEmail(@Param("id") Long id, @Param("email") String email);

    long countByUserAndGroupNameAndCompleted(User user, String groupName, boolean b);

    long countByUserAndCompleted(User user, boolean b);
    List<Todo> findByCompletedFalse();
    List<Todo> findByCompletedTrue();
    // In TodoRepository.java
    List<Todo> findByTemplate_Id(Long id);
    List<Todo> findByTemplate_IdAndCompletedFalse(Long templateId);

}


