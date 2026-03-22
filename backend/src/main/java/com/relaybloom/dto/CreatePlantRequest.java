package com.relaybloom.dto;

import lombok.Data;

@Data
public class CreatePlantRequest {
    private String name;
    private String description;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private Integer allowedRadiusMeter;
    private Integer thresholdHours;
    private String mainImageUrl;
    private String qrCodeUrl;
}
