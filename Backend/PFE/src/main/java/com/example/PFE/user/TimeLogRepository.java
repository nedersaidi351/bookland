package com.example.PFE.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findByUserEmail(String email);

    @Query("SELECT t FROM TimeLog t WHERE t.userEmail = :email AND t.startTime BETWEEN :from AND :to")
    List<TimeLog> findByUserEmailAndDateRange(
            @Param("email") String email,
            @Param("from") LocalDateTime from,
            @Param("to") LocalDateTime to
    );
}

