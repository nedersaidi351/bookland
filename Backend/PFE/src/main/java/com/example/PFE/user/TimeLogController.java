package com.example.PFE.user;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/timelog")
public class TimeLogController {

    @Autowired
    private TimeLogService timeLogService;
    @Autowired
    private TimeLogRepository timeLogRepository;

    @PostMapping("/start")
    public ResponseEntity<TimeLog> start(@RequestParam String email) {
        return ResponseEntity.ok(timeLogService.startTracking(email));
    }

    @PostMapping("/stop/{logId}")
    public ResponseEntity<?> stopTracking(@PathVariable Long logId) {
        Optional<TimeLog> optionalLog = timeLogRepository.findById(logId);
        if (optionalLog.isPresent()) {
            TimeLog log = optionalLog.get();
            log.setEndTime(LocalDateTime.now()); // Set actual end time
            timeLogRepository.save(log);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @GetMapping("/logs")
    public ResponseEntity<List<TimeLog>> getLogs(
            @RequestParam String email,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to
    ) {
        if (from != null && to != null) {
            return ResponseEntity.ok(timeLogService.getLogsByDateRange(email, from, to));
        } else {
            return ResponseEntity.ok(timeLogService.getLogs(email));
        }
    }

}
