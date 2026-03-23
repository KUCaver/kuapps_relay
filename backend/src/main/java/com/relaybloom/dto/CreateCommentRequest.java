package com.relaybloom.dto;

import lombok.Data;

@Data
public class CreateCommentRequest {
    private String nickname;
    private String content;
}
