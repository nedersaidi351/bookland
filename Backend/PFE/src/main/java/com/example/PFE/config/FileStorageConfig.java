package com.example.PFE.config;

import com.example.PFE.user.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FileStorageConfig {

    @Bean
    public FileStorageService fileStorageService(
            @Value("${file.upload-dir}") String uploadDir) {
        return new FileStorageService(uploadDir);
    }
}
