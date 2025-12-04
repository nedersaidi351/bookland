package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {


    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PostLikeRepository postLikeRepository;
    private PostService postService;

    @PostMapping
    public ResponseEntity<PostDTO> createPost(@RequestBody Post post) {
        String email = post.getUser().getEmail();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        post.setUser(user);
        post.setCreatedAt(LocalDateTime.now());
        Post savedPost = postRepository.save(post);

        PostDTO dto = new PostDTO();
        dto.setId(savedPost.getId());
        dto.setContent(savedPost.getContent());
        dto.setEmail(savedPost.getUser().getEmail());
        dto.setLikeCount(savedPost.getLikeCount());
        dto.setCreatedAt(savedPost.getCreatedAt());

        return ResponseEntity.ok(dto);
    }


    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        try {
            List<Post> posts = postRepository.findAllByOrderByCreatedAtDesc();

            // Verify data before conversion
            posts.forEach(post -> {
                if (post.getUser() == null) {
                    throw new IllegalStateException("Post with ID " + post.getId() + " has no user assigned");
                }
            });

            List<PostDTO> postDTOs = posts.stream()
                    .map(PostDTO::new)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postDTOs);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Error fetching posts: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PostDTO> getPostById(@PathVariable Integer id) {
        Object post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return ResponseEntity.ok(new PostDTO((Post) post));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<?> likePost(@PathVariable Long postId, @RequestParam String email) {
        try {
            Optional<User> optionalUser = userRepository.findByEmail(email);
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }

            User user = optionalUser.get();

            // Check if the user has already liked this post
            if (user.getLikedPosts().contains(postId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                        .body("You have already liked this post.");
            }

            Optional<Post> optionalPost = postRepository.findById(postId);
            if (optionalPost.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            Post post = optionalPost.get();
            post.setLikeCount(post.getLikeCount() + 1);  // Increment like count
            postRepository.save(post);  // Save post with updated like count

            // Add the postId to the user's list of liked posts
            user.getLikedPosts().add(postId);
            userRepository.save(user);

            return ResponseEntity.ok(post);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error processing like.");
        }
    }

    @GetMapping("/user-posts")
    public ResponseEntity<?> getPostsByLoggedInUser(Principal principal) {
        try {
            String email = principal.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Post> posts = postRepository.findByUserId(user.getId());

            List<PostDTO> postDTOs = posts.stream()
                    .map(PostDTO::new)  // Use constructor that handles image
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user posts: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public ResponseEntity<?> getPostsByUserEmail(@RequestParam String email) {
        try {
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Post> posts = postRepository.findByUserId(user.getId());

            List<PostDTO> postDTOs = posts.stream()
                    .map(PostDTO::new)  // Use constructor that includes user image
                    .collect(Collectors.toList());

            return ResponseEntity.ok(postDTOs);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error fetching user posts: " + e.getMessage());
        }
    }


    @DeleteMapping("/posts/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Return 204 instead of 200
    }



    // Save new achievement (example)



}