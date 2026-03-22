package com.relaybloom.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PlantLogDto {
    private Long id;
    private Long plantId;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Boolean watered;
    private Boolean isHealthy;
    private Boolean hasIssue;
    private String issueNote;
    private String relayMessage;
    private Integer guardianOrder;
    private LocalDateTime createdAt;
}
