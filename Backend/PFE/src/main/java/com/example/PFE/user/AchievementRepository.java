package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    Optional<Achievement> findByName(String name);

    @Query("SELECT COUNT(ua) > 0 FROM UserAchievement ua WHERE ua.user = :user AND ua.achievement.name LIKE :namePrefix%")
    boolean existsByUserAndNameStartingWith(@Param("user") User user, @Param("namePrefix") String namePrefix);

    @Query("SELECT COUNT(ua) > 0 FROM UserAchievement ua WHERE ua.user = :user AND ua.achievement.name = :name")
    boolean existsByNameAndUser(@Param("name") String name, @Param("user") User user);
    List<Achievement> findByUserId(Long userId);

}
