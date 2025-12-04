package com.example.PFE.user;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:4200") // allow all origins
@RequestMapping("/api/v1")
public class UserController {
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final PostService postService;
    private final PostRepository postRepository;

    public UserController(UserService userService, PasswordEncoder passwordEncoder, PostService postService, PostRepository postRepository) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;

        this.postService = postService;
        this.postRepository = postRepository;
    }

    @GetMapping("/by-email")
    public ResponseEntity<User> getUserByEmail(@RequestParam String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PostMapping("/upload-image")
    public ResponseEntity<?> uploadUserImage(@RequestParam("email") String email,
                                             @RequestParam("image") MultipartFile file) {
        try {
            User user = userService.getUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
            }

            user.setImage(file.getBytes());
            userService.saveUser(user); // save the user with the new image

            return ResponseEntity.ok("Image uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Image upload failed");
        }
    }
    @GetMapping("/image")
    public ResponseEntity<byte[]> getUserImage(@RequestParam String email) {
        User user = userService.getUserByEmail(email);
        if (user != null && user.getImage() != null) {
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(user.getImage());
        }
        return ResponseEntity.notFound().build();
    }
    // Get all users
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    // Create new user
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        if (!user.getPassword().equals(user.getConfpassword())) {
            return ResponseEntity.badRequest().build();
        }

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setConfpassword(passwordEncoder.encode(user.getConfpassword())); // Do not store confpassword

        User createdUser = userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }

    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(
            @PathVariable Integer id,
            @RequestBody UserUpdateRequest userDetails
    ) {
        // Verify password confirmation if password is being changed
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            if (!userDetails.getPassword().equals(userDetails.getConfpassword())) {
                return ResponseEntity.badRequest().build();
            }
        }

        User updatedUser = userService.updateUser(id, userDetails);
        return ResponseEntity.ok(updatedUser);
    }

    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    //get poot achie




    @GetMapping("/{userId}/achievements")
    public ResponseEntity<List<UserAchievement>> getUserAchievements(@PathVariable Long userId) {
        List<UserAchievement> achievements = userService.getAchievementsForUser(userId);
        return ResponseEntity.ok(achievements);
    }



}
