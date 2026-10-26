package com.example.feedback.controller;


import com.example.feedback.entity.Feedback;
import com.example.feedback.service.FeedbackService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    @PostMapping("/{userId}")
    public ResponseEntity<Feedback> addFeedback(
            @PathVariable Long userId,
            @RequestBody Feedback feedback) {

        Feedback savedFeedback = feedbackService.addFeedback(userId, feedback);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedFeedback);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getUserFeedback(
            @PathVariable Long userId) {

        return ResponseEntity.ok(feedbackService.getUserFeedback(userId));
    }

    @PutMapping("/{feedbackId}/user/{userId}")
    public ResponseEntity<Feedback> updateFeedback(
            @PathVariable Long feedbackId,
            @PathVariable Long userId,
            @RequestBody Feedback updatedFeedback) {

        Feedback feedback = feedbackService.updateFeedback(
                feedbackId, userId, updatedFeedback);

        return ResponseEntity.ok(feedback);
    }

}

