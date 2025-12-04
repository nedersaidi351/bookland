package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    boolean existsByUserAndAchievement(User user, Achievement achievement);
    List<UserAchievement> findByUser(User user);
    List<UserAchievement> findByUserId(Long userId);
    void deleteByUserId(Long userId);

}
