package com.example.feedback.service;

import com.example.feedback.entity.Feedback;
import com.example.feedback.entity.User;
import com.example.feedback.repository.FeedbackRepository;
import com.example.feedback.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class FeedbackService {


    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackService(
            FeedbackRepository feedbackRepository,
            UserRepository userRepository) {

        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    public Feedback addFeedback(Long userId, Feedback feedback) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        if (feedbackRepository.existsByUserId(userId)) {
            throw new IllegalArgumentException(
                    "You have already submitted feedback");
        }

        feedback.setId(null);
        feedback.setUser(user);
        feedback.setDate(LocalDate.now());

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getUserFeedback(Long userId) {

        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found");
        }

        return feedbackRepository.findByUserId(userId);
    }

    public Feedback updateFeedback(
            Long feedbackId,
            Long userId,
            Feedback updatedFeedback) {

        Feedback feedback = feedbackRepository
                .findByUserIdAndId(userId, feedbackId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Feedback not found"));

        feedback.setMessage(updatedFeedback.getMessage());

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public Feedback getFeedbackById(Long id) {

        return feedbackRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Feedback not found"));
    }

    public Feedback updateFeedbackByAdmin(
            Long id,
            Feedback updatedFeedback) {

        Feedback feedback = getFeedbackById(id);

        feedback.setMessage(updatedFeedback.getMessage());

        return feedbackRepository.save(feedback);
    }

    public void deleteFeedback(Long id) {

        Feedback feedback = getFeedbackById(id);

        feedbackRepository.delete(feedback);
    }


}

