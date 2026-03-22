package com.relaybloom.service;

import com.relaybloom.dto.PlantDto;
import com.relaybloom.entity.Plant;
import com.relaybloom.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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
                .orElseThrow(() -> new RuntimeException("Plant not found"));
        return convertToDto(plant);
    }

    private PlantDto convertToDto(Plant plant) {
        return PlantDto.builder()
                .id(plant.getId())
                .name(plant.getName())
                .description(plant.getDescription())
                .locationName(plant.getLocationName())
                .latitude(plant.getLatitude())
                .longitude(plant.getLongitude())
                .allowedRadiusMeter(plant.getAllowedRadiusMeter())
                .currentStatus(plant.getCurrentStatus())
                .mainImageUrl(plant.getMainImageUrl())
                .qrCodeUrl(plant.getQrCodeUrl())
                .updatedAt(plant.getUpdatedAt())
                .build();
    }
}
