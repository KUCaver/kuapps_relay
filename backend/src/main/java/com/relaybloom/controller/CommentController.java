package com.relaybloom.controller;

import com.relaybloom.dto.CommentDto;
import com.relaybloom.dto.CreateCommentRequest;
import com.relaybloom.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    // 일반 사용자: 댓글 조회 + 작성
    @GetMapping("/api/logs/{logId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable Long logId) {
        return ResponseEntity.ok(commentService.getCommentsByLogId(logId));
    }

    @PostMapping("/api/logs/{logId}/comments")
    public ResponseEntity<CommentDto> createComment(
            @PathVariable Long logId,
            @RequestBody CreateCommentRequest request) {
        return ResponseEntity.ok(commentService.createComment(logId, request));
    }

    // 관리자: 댓글 삭제
    @DeleteMapping("/api/admin/comments/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        commentService.deleteComment(id);
        return ResponseEntity.noContent().build();
    }
}
