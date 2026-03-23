package com.relaybloom.repository;

import com.relaybloom.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPlantLogIdOrderByCreatedAtAsc(Long plantLogId);
    void deleteAllByPlantLogId(Long plantLogId);
}
