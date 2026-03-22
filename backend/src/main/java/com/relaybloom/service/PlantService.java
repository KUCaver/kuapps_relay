package com.relaybloom.service;

import com.relaybloom.dto.CreatePlantRequest;
import com.relaybloom.dto.PlantDto;
import com.relaybloom.entity.Plant;
import com.relaybloom.entity.Status;
import com.relaybloom.repository.PlantLogRepository;
import com.relaybloom.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlantService {

    private final PlantRepository plantRepository;
    private final PlantLogRepository plantLogRepository;

    public List<PlantDto> getAllPlants() {
        return plantRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public PlantDto getPlantById(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found: " + id));
        return convertToDto(plant);
    }

    @Transactional
    public PlantDto createPlant(CreatePlantRequest request) {
        Plant plant = Plant.builder()
                .name(request.getName())
                .description(request.getDescription())
                .locationName(request.getLocationName())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .allowedRadiusMeter(request.getAllowedRadiusMeter())
                .thresholdHours(request.getThresholdHours())
                .mainImageUrl(request.getMainImageUrl())
                .qrCodeUrl(request.getQrCodeUrl())
                .currentStatus(Status.NORMAL)
                .build();
        return convertToDto(plantRepository.save(plant));
    }

    @Transactional
    public PlantDto updatePlant(Long id, CreatePlantRequest request) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found: " + id));
        if (request.getName() != null) plant.setName(request.getName());
        if (request.getDescription() != null) plant.setDescription(request.getDescription());
        if (request.getLocationName() != null) plant.setLocationName(request.getLocationName());
        if (request.getLatitude() != null) plant.setLatitude(request.getLatitude());
        if (request.getLongitude() != null) plant.setLongitude(request.getLongitude());
        if (request.getAllowedRadiusMeter() != null) plant.setAllowedRadiusMeter(request.getAllowedRadiusMeter());
        if (request.getThresholdHours() != null) plant.setThresholdHours(request.getThresholdHours());
        if (request.getMainImageUrl() != null) plant.setMainImageUrl(request.getMainImageUrl());
        return convertToDto(plantRepository.save(plant));
    }

    @Transactional
    public void deletePlant(Long id) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found: " + id));
        // cascade로 관련 로그도 함께 삭제
        plantRepository.delete(plant);
    }

    @Transactional
    public PlantDto changeStatus(Long id, Status status) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found: " + id));
        plant.setCurrentStatus(status);
        return convertToDto(plantRepository.save(plant));
    }

    public PlantDto convertToDto(Plant plant) {
        return PlantDto.builder()
                .id(plant.getId())
                .name(plant.getName())
                .description(plant.getDescription())
                .locationName(plant.getLocationName())
                .latitude(plant.getLatitude())
                .longitude(plant.getLongitude())
                .allowedRadiusMeter(plant.getAllowedRadiusMeter())
                .currentStatus(plant.getCurrentStatus())
                .thresholdHours(plant.getThresholdHours())
                .mainImageUrl(plant.getMainImageUrl())
                .qrCodeUrl(plant.getQrCodeUrl())
                .updatedAt(plant.getUpdatedAt())
                .build();
    }
}
