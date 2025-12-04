package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserAchievementRepository userAchievementRepository;
    @Autowired
    private PurchaseRepository purchaseRepository;


    @Autowired
    private AchievementRepository achievementRepository;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Get all users
    public List<User> getAllUsers() {
        return userRepository.findByEmailNot("admin@gmail.com");
    }


    // Get user by email
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    // Get user by ID
    public User getUserById(Integer id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    // Create a new user
    public User createUser(User user) {
        // You might want to add validation here
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }
        return userRepository.save(user);
    }

    // Update an existing user
    public User updateUser(Integer id, UserUpdateRequest userDetails) {
        User user = getUserById(id);

        // Update fields if they're not null in userDetails
        if (userDetails.getFirstname() != null) {
            user.setFirstname(userDetails.getFirstname());
        }
        if (userDetails.getLastname() != null) {
            user.setLastname(userDetails.getLastname());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().equals(user.getEmail())) {
            if (userRepository.existsByEmail(userDetails.getEmail())) {
                throw new IllegalArgumentException("Email already in use");
            }
            user.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDetails.getPassword()));
        }
        if (userDetails.getConfpassword() != null && !userDetails.getConfpassword().isEmpty()) {
            user.setConfpassword(passwordEncoder.encode(userDetails.getConfpassword()));
        }
        if (userDetails.getImage() != null) {
            user.setImage(userDetails.getImage());
        }

        return userRepository.save(user);
    }

    // Delete a user
    @Transactional
    public void deleteUser(Integer id) {
        try {
            User user = getUserById(id);

            // Delete user’s purchases
            List<Purchase> purchases = purchaseRepository.findByUserEmail(user.getEmail());
            purchaseRepository.deleteAll(purchases);

            // Delete user’s posts
            postRepository.deleteByUser(user);

            // Delete user’s achievements
            userAchievementRepository.deleteByUserId(user.getId().longValue());

            // Finally delete user
            userRepository.delete(user);
        } catch (Exception e) {
            e.printStackTrace(); // Logs the root cause to console
            throw new RuntimeException("Error deleting user: " + e.getMessage());
        }
    }




    // Check if email exists
    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }
    public void saveUser(User user) {
        userRepository.save(user);
    }
    /// /




    public List<UserAchievement> getAchievementsForUser(Long userId) {
        return userAchievementRepository.findByUserId(userId);
    }
}