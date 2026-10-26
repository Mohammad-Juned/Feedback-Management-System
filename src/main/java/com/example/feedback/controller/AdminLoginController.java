package com.example.feedback.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminLoginController {

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> adminLogin(
            @RequestBody Map<String, String> credentials) {

        String username = credentials.get("username");
        String password = credentials.get("password");

        Map<String, String> response = new HashMap<>();

        if ("admin".equals(username) && "admin123".equals(password)) {
            response.put("message", "Admin login successful");
            response.put("role", "ADMIN");

            return ResponseEntity.ok(response);
        }

        response.put("message", "Invalid admin username or password");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

}
