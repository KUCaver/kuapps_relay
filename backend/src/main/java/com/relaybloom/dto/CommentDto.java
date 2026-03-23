package com.relaybloom.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentDto {
    private Long id;
    private Long plantLogId;
    private String nickname;
    private String content;
    private String createdAt;
}
