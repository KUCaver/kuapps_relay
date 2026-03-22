package com.relaybloom.dto;

import lombok.Data;

@Data
public class PlantLogRequest {
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private Boolean watered;
    private Boolean isHealthy;
    private Boolean hasIssue;
    private String issueNote;
    private String relayMessage;
}
