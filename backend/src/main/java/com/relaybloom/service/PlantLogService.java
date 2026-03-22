package com.relaybloom.service;

import com.relaybloom.dto.PlantLogDto;
import com.relaybloom.dto.PlantLogRequest;
import com.relaybloom.entity.Plant;
import com.relaybloom.entity.PlantLog;
import com.relaybloom.entity.Status;
import com.relaybloom.repository.PlantLogRepository;
import com.relaybloom.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlantLogService {

    private final PlantLogRepository plantLogRepository;
    private final PlantRepository plantRepository;

    public List<PlantLogDto> getLogsByPlantId(Long plantId) {
        return plantLogRepository.findByPlantIdOrderByCreatedAtDesc(plantId)
                .stream().map(this::convertToDto).collect(Collectors.toList());
    }

    public PlantLogDto getLogById(Long id) {
        PlantLog log = plantLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("PlantLog not found"));
        return convertToDto(log);
    }

    @Transactional
    public PlantLogDto createLog(Long plantId, PlantLogRequest request) {
        Plant plant = plantRepository.findById(plantId)
                .orElseThrow(() -> new RuntimeException("Plant not found"));
        
        if (request.getWatered() != null && request.getWatered()) {
            plant.setCurrentStatus(Status.NORMAL);
        } else if (request.getHasIssue() != null && request.getHasIssue()) {
            plant.setCurrentStatus(Status.DANGER);
        }
        plant.setUpdatedAt(LocalDateTime.now());
        plantRepository.save(plant);

        int currentOrder = plantLogRepository.countByPlantId(plantId);

        PlantLog log = PlantLog.builder()
                .plant(plant)
                .imageUrl(request.getImageUrl())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .watered(request.getWatered())
                .isHealthy(request.getIsHealthy())
                .hasIssue(request.getHasIssue())
                .issueNote(request.getIssueNote())
                .relayMessage(request.getRelayMessage())
                .guardianOrder(currentOrder + 1)
                .build();

        plantLogRepository.save(log);
        return convertToDto(log);
    }

    private PlantLogDto convertToDto(PlantLog log) {
        return PlantLogDto.builder()
                .id(log.getId())
                .plantId(log.getPlant().getId())
                .imageUrl(log.getImageUrl())
                .latitude(log.getLatitude())
                .longitude(log.getLongitude())
                .watered(log.getWatered())
                .isHealthy(log.getIsHealthy())
                .hasIssue(log.getHasIssue())
                .issueNote(log.getIssueNote())
                .relayMessage(log.getRelayMessage())
                .guardianOrder(log.getGuardianOrder())
                .createdAt(log.getCreatedAt())
                .build();
    }
}
