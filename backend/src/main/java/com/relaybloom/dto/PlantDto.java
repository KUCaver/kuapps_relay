package com.relaybloom.dto;

import com.relaybloom.entity.Status;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PlantDto {
    private Long id;
    private String name;
    private String description;
    private String locationName;
    private Double latitude;
    private Double longitude;
    private Integer allowedRadiusMeter;
    private Status currentStatus;
    private String mainImageUrl;
    private String qrCodeUrl;
    private LocalDateTime updatedAt;
}
