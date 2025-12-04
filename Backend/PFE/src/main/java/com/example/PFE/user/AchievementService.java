package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class AchievementService {
    @Autowired
    private TodoRepository todoRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private UserAchievementRepository userAchievementRepository;

    @Autowired
    private UserRepository userRepository;

    public void checkTaskCompletionAchievements(User user) {
        long totalCompleted = todoRepository.countByUserAndCompleted(user, true);

        // Check each achievement level individually
        if (totalCompleted >= 3 && !hasAchievement(user, "Bronze Trophy")) {
            grantAchievement(user, "Bronze Trophy",
                    "Completed 3 tasks",
                    "bronze");
        }
        if (totalCompleted >= 6 && !hasAchievement(user, "Silver Trophy")) {
            grantAchievement(user, "Silver Trophy",
                    "Completed 6 tasks",
                    "silver");
        }
        if (totalCompleted >= 9 && !hasAchievement(user, "Gold Trophy")) {
            grantAchievement(user, "Gold Trophy",
                    "Completed 9 tasks",
                    "gold");
        }
        if (totalCompleted >= 12 && !hasAchievement(user, "Diamond Trophy")) {
            grantAchievement(user, "Diamond Trophy",
                    "Completed 12 tasks",
                    "diamond");
        }
        if (totalCompleted >= 15 && !hasAchievement(user, "Platinum Trophy")) {
            grantAchievement(user, "Platinum Trophy",
                    "Completed 15 tasks",
                    "platinum");
        }
    }

    // Helper method to check if user already has a specific achievement
    private boolean hasAchievement(User user, String achievementName) {
        return achievementRepository.findByName(achievementName)
                .map(achievement -> userAchievementRepository.existsByUserAndAchievement(user, achievement))
                .orElse(false);
    }

    private void grantAchievement(User user, String name, String description, String tier) {
        user = userRepository.findById(user.getId()).orElse(user);

        Achievement achievement = achievementRepository.findByName(name)
                .orElseGet(() -> {
                    Achievement newAchievement = new Achievement();
                    newAchievement.setName(name);
                    newAchievement.setDescription(description);
                    newAchievement.setTier(tier);
                    newAchievement.setIconUrl(null);
                    return achievementRepository.save(newAchievement);
                });

        if (!userAchievementRepository.existsByUserAndAchievement(user, achievement)) {
            UserAchievement userAchievement = new UserAchievement();
            userAchievement.setUser(user);
            userAchievement.setAchievement(achievement);
            userAchievement.setEarnedAt(LocalDateTime.now());
            userAchievementRepository.save(userAchievement);
        }
    }
}