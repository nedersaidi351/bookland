package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TimeLogService {

    @Autowired
    private TimeLogRepository timeLogRepository;
    public List<TimeLog> getLogs(String email) {
        return timeLogRepository.findByUserEmail(email);
    }

    public TimeLog startTracking(String userEmail) {
        TimeLog timeLog = new TimeLog();
        timeLog.setUserEmail(userEmail);
        timeLog.setStartTime(LocalDateTime.now());
        return timeLogRepository.save(timeLog);
    }

    public TimeLog stopTracking(Long id) {
        Optional<TimeLog> optionalTimeLog = timeLogRepository.findById(id);
        if (optionalTimeLog.isPresent()) {
            TimeLog timeLog = optionalTimeLog.get();
            timeLog.setEndTime(LocalDateTime.now());
            return timeLogRepository.save(timeLog);
        }
        throw new RuntimeException("TimeLog not found");
    }

    public List<TimeLog> getLogsByDateRange(String email, LocalDateTime from, LocalDateTime to) {
        return timeLogRepository.findByUserEmailAndDateRange(email, from, to);
    }
}

