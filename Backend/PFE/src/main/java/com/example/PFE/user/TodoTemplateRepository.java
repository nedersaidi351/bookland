package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface TodoTemplateRepository extends JpaRepository<TodoTemplate, Long> {
    TodoTemplate save(TodoTemplate template);
    List<TodoTemplate> findByGroupName(String groupName);

    List<TodoTemplate> findAll();
}
