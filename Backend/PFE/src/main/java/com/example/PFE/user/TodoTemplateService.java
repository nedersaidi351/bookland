package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TodoTemplateService {
    @Autowired
    private TodoRepository todoRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TodoTemplateRepository todoTemplateRepository;
    @Autowired
    private AchievementRepository achievementRepository;
    @Autowired
    private UserAchievementRepository userAchievementRepository;
    @Autowired
    private AchievementService achievementService;

    public TodoTemplate updateTodoTemplate(Long id, TodoTemplate updatedTemplate) {
        TodoTemplate existingTemplate = todoTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found"));

        existingTemplate.setTitle(updatedTemplate.getTitle());
        existingTemplate.setDescription(updatedTemplate.getDescription());
        existingTemplate.setGroupName(updatedTemplate.getGroupName());

        TodoTemplate savedTemplate = todoTemplateRepository.save(existingTemplate);

        // Update only incomplete Todos linked to this template
        List<Todo> incompleteTodos = todoRepository.findByTemplate_IdAndCompletedFalse(id);
        for (Todo todo : incompleteTodos) {
            todo.setTitle(updatedTemplate.getTitle());
            todo.setDescription(updatedTemplate.getDescription());
            todo.setGroupName(updatedTemplate.getGroupName());
        }
        todoRepository.saveAll(incompleteTodos);

        return savedTemplate;
    }


    public Optional<TodoTemplate> getTodoTemplateById(Long id) {
        try {
            return todoTemplateRepository.findById(id);
        } catch (Exception e) {
            throw new RuntimeException("Database error while fetching template", e);
        }
    }

    /// /
    public void deleteTodoTemplate(Long id) {
        // First check if template exists
        TodoTemplate template = todoTemplateRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Template not found with id: " + id));

        // Optional: Handle any todos linked to this template before deletion
        // Either delete them or set their template reference to null
        List<Todo> todosWithTemplate = todoRepository.findByTemplate_Id(id);
        for (Todo todo : todosWithTemplate) {
            todo.setTemplate(null); // Or todoRepository.delete(todo) if you want to delete them
        }
        todoRepository.saveAll(todosWithTemplate);

        // Now delete the template
        todoTemplateRepository.delete(template);
    }

}
