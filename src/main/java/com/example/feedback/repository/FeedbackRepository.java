package com.example.feedback.repository;

import com.example.feedback.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {


    List<Feedback> findByUserId(Long userId);

    Optional<Feedback> findByUserIdAndId(Long userId, Long id);

    boolean existsByUserId(Long userId);

}
