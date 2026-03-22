package com.relaybloom.service;

import com.relaybloom.dto.PlantDto;
import com.relaybloom.entity.Plant;
import com.relaybloom.entity.Status;
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
    public PlantDto createPlant(Plant plant) {
        plant.setCurrentStatus(Status.NORMAL);
        return convertToDto(plantRepository.save(plant));
    }

    @Transactional
    public PlantDto updatePlant(Long id, Plant updated) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found: " + id));
        if (updated.getName() != null) plant.setName(updated.getName());
        if (updated.getDescription() != null) plant.setDescription(updated.getDescription());
        if (updated.getLocationName() != null) plant.setLocationName(updated.getLocationName());
        if (updated.getLatitude() != null) plant.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) plant.setLongitude(updated.getLongitude());
        if (updated.getAllowedRadiusMeter() != null) plant.setAllowedRadiusMeter(updated.getAllowedRadiusMeter());
        if (updated.getThresholdHours() != null) plant.setThresholdHours(updated.getThresholdHours());
        if (updated.getMainImageUrl() != null) plant.setMainImageUrl(updated.getMainImageUrl());
        if (updated.getCurrentStatus() != null) plant.setCurrentStatus(updated.getCurrentStatus());
        return convertToDto(plantRepository.save(plant));
    }

    @Transactional
    public void deletePlant(Long id) {
        if (!plantRepository.existsById(id)) {
            throw new RuntimeException("Plant not found: " + id);
        }
        plantRepository.deleteById(id);
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
