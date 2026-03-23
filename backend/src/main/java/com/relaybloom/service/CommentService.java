package com.relaybloom.service;

import com.relaybloom.dto.CommentDto;
import com.relaybloom.dto.CreateCommentRequest;
import com.relaybloom.entity.Comment;
import com.relaybloom.entity.PlantLog;
import com.relaybloom.repository.CommentRepository;
import com.relaybloom.repository.PlantLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PlantLogRepository plantLogRepository;

    public List<CommentDto> getCommentsByLogId(Long logId) {
        return commentRepository.findByPlantLogIdOrderByCreatedAtAsc(logId)
                .stream().map(this::toDto).collect(Collectors.toList());
    }

    @Transactional
    public CommentDto createComment(Long logId, CreateCommentRequest request) {
        if (request.getNickname() == null || request.getNickname().isBlank()) {
            throw new IllegalArgumentException("닉네임을 입력해주세요.");
        }
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new IllegalArgumentException("댓글 내용을 입력해주세요.");
        }
        if (request.getNickname().length() > 50) {
            throw new IllegalArgumentException("닉네임은 50자 이내여야 합니다.");
        }
        if (request.getContent().length() > 300) {
            throw new IllegalArgumentException("댓글은 300자 이내여야 합니다.");
        }

        PlantLog log = plantLogRepository.findById(logId)
                .orElseThrow(() -> new RuntimeException("PlantLog not found: " + logId));

        Comment comment = Comment.builder()
                .plantLog(log)
                .nickname(request.getNickname())
                .content(request.getContent())
                .build();

        return toDto(commentRepository.save(comment));
    }

    @Transactional
    public void deleteComment(Long commentId) {
        if (!commentRepository.existsById(commentId)) {
            throw new RuntimeException("Comment not found: " + commentId);
        }
        commentRepository.deleteById(commentId);
    }

    private CommentDto toDto(Comment c) {
        return CommentDto.builder()
                .id(c.getId())
                .plantLogId(c.getPlantLog().getId())
                .nickname(c.getNickname())
                .content(c.getContent())
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().toString() : null)
                .build();
    }
}
