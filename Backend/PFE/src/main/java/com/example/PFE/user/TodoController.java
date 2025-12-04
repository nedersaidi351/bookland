package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:4200")
public class TodoController {

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
    @Autowired
    private TodoTemplateService todoTemplateService;

    @GetMapping("/user/email/{email}")
    public ResponseEntity<Map<String, List<Todo>>> getGroupedTodosByEmail(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    ensureUserHasTemplateTasks(user);
                    List<Todo> userTodos = todoRepository.findByUser(user);
                    Map<String, List<Todo>> groupedTodos = userTodos.stream()
                            .collect(Collectors.groupingBy(
                                    todo -> todo.getGroupName() != null ? todo.getGroupName() : "Ungrouped"
                            ));
                    return ResponseEntity.ok(groupedTodos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private void ensureUserHasTemplateTasks(User user) {
        List<TodoTemplate> templates = todoTemplateRepository.findAll();
        List<Todo> userTodos = todoRepository.findByUser(user);

        templates.forEach(template -> {
            boolean hasTemplate = userTodos.stream()
                    .anyMatch(todo -> todo.getTemplate() != null && todo.getTemplate().getId().equals(template.getId()));

            if (!hasTemplate) {
                Todo userTodo = new Todo();
                userTodo.setTitle(template.getTitle());
                userTodo.setDescription(template.getDescription());
                userTodo.setGroupName(template.getGroupName());
                userTodo.setTemplate(template);
                userTodo.setUser(user);
                userTodo.setCompleted(false);

                todoRepository.save(userTodo);
            }
        });
    }

    // Admin endpoints
    @PostMapping("/template")
    public ResponseEntity<TodoTemplate> createTemplateTask(@RequestBody TodoTemplate template) {
        template.setSystemDefault(true);
        return ResponseEntity.ok(todoTemplateRepository.save(template));
    }

    @GetMapping("/template")
    public ResponseEntity<List<TodoTemplate>> getAllTemplateTasks() {
        return ResponseEntity.ok(todoTemplateRepository.findAll());
    }
    // TodoTemplateController.java
    @GetMapping("/template/{id}")
    public ResponseEntity<?> getTodoTemplateById(@PathVariable Long id) {
        try {
            Optional<TodoTemplate> template = todoTemplateService.getTodoTemplateById(id);
            return template.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            // Log the full error for debugging
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body("Error fetching template: " + e.getMessage());
        }
    }

    @PutMapping("/template/{id}")
    public ResponseEntity<TodoTemplate> updateTodoTemplate(
            @PathVariable Long id,
            @RequestBody TodoTemplate updatedTemplate) {
        try {
            TodoTemplate updated = todoTemplateService.updateTodoTemplate(id, updatedTemplate);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }




    @PatchMapping("/{id}/complete")
    public ResponseEntity<?> updateCompletionStatus(
            @PathVariable Long id,
            @RequestParam boolean completed,
            @RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    return todoRepository.findByIdAndUserEmail(id, email)
                            .map(todo -> {
                                // Only proceed if changing from incomplete to complete
                                if (!todo.isCompleted() && completed) {
                                    todo.setCompleted(completed);
                                    Todo savedTodo = todoRepository.save(todo);

                                    // Check task completion achievements only
                                    achievementService.checkTaskCompletionAchievements(user);

                                    return ResponseEntity.ok(savedTodo);
                                } else if (todo.isCompleted() && !completed) {
                                    // Handle marking complete -> incomplete if needed
                                    todo.setCompleted(completed);
                                    return ResponseEntity.ok(todoRepository.save(todo));
                                }
                                return ResponseEntity.ok(todo); // No change needed
                            })
                            .orElse(ResponseEntity.notFound().build());
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{email}/achievements")
    public ResponseEntity<List<UserAchievement>> getUserAchievements(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(userAchievementRepository.findByUser(user)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/achievement/icons")
    public ResponseEntity<List<Achievement>> getAllAchievementIcons() {
        return ResponseEntity.ok(achievementRepository.findAll());
    }

    @PostMapping("/check-achievements")
    public ResponseEntity<String> checkAllAchievements(@RequestParam String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    achievementService.checkTaskCompletionAchievements(user);
                    return ResponseEntity.ok("Achievement check completed");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/achievement-progress/{email}")
    public ResponseEntity<Map<String, Object>> getAchievementProgress(@PathVariable String email) {
        return userRepository.findByEmail(email)
                .map(user -> {
                    long totalCompleted = todoRepository.countByUserAndCompleted(user, true);
                    Map<String, Object> response = Map.of(
                            "totalCompleted", totalCompleted
                    );
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/incomplete-info")
    public ResponseEntity<List<TodoInfoDTO>> getIncompleteTodosInfo() {
        List<Todo> todos = todoRepository.findByCompletedFalse();
        List<TodoInfoDTO> dtoList = todos.stream()
                .map(todo -> new TodoInfoDTO(
                        todo.getId(),
                        todo.getGroupName(),
                        todo.getTitle(),
                        todo.getDescription(),
                        todo.getUser().getFirstNames(),
                        todo.getUser().getLastNames()
                ))
                .toList();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/completed-info")
    public ResponseEntity<List<TodoInfoDTO>> getCompletedTodosInfo() {
        List<Todo> todos = todoRepository.findByCompletedTrue();
        List<TodoInfoDTO> dtoList = todos.stream()
                .map(todo -> new TodoInfoDTO(
                        todo.getId(),
                        todo.getGroupName(),
                        todo.getTitle(),
                        todo.getDescription(),
                        todo.getUser().getFirstNames(),
                        todo.getUser().getLastNames()
                ))
                .toList();
        return ResponseEntity.ok(dtoList);
    }
    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable Long id, @RequestBody Todo updatedTodo) {
        return todoRepository.findById(id)
                .map(existingTodo -> {
                    existingTodo.setTitle(updatedTodo.getTitle());
                    existingTodo.setDescription(updatedTodo.getDescription());
                    existingTodo.setGroupName(updatedTodo.getGroupName());
                    return ResponseEntity.ok(todoRepository.save(existingTodo));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping("/{id}")
    public ResponseEntity<Todo> getTodoById(@PathVariable Long id) {
        Optional<Todo> todo = todoRepository.findById(id);
        if (todo.isPresent()) {
            return ResponseEntity.ok(todo.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

///
@DeleteMapping("/template/{id}")
public ResponseEntity<?> deleteTodoTemplate(@PathVariable Long id) {
    try {
        // Check if template exists first
        if (!todoTemplateRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // Handle associated todos
        List<Todo> todosWithTemplate = todoRepository.findByTemplate_Id(id);
        todosWithTemplate.forEach(todo -> todo.setTemplate(null));
        todoRepository.saveAll(todosWithTemplate);

        // Delete the template
        todoTemplateRepository.deleteById(id);

        return ResponseEntity.ok().build();
    } catch (Exception e) {
        return ResponseEntity.internalServerError()
                .body("Failed to delete template: " + e.getMessage());
    }
}

}