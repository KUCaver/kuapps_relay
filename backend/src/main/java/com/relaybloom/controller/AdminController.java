package com.relaybloom.controller;

import com.relaybloom.entity.Plant;
import com.relaybloom.entity.PlantLog;
import com.relaybloom.entity.Status;
import com.relaybloom.entity.ValidationStatus;
import com.relaybloom.repository.PlantLogRepository;
import com.relaybloom.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PlantRepository plantRepository;
    private final PlantLogRepository plantLogRepository;

    // ===== Plant CRUD =====

    @PostMapping("/plants")
    public ResponseEntity<Plant> createPlant(@RequestBody Plant plant) {
        return ResponseEntity.ok(plantRepository.save(plant));
    }

    @PutMapping("/plants/{id}")
    public ResponseEntity<Plant> updatePlant(@PathVariable Long id, @RequestBody Plant updated) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found"));
        if (updated.getName() != null) plant.setName(updated.getName());
        if (updated.getDescription() != null) plant.setDescription(updated.getDescription());
        if (updated.getLocationName() != null) plant.setLocationName(updated.getLocationName());
        if (updated.getLatitude() != null) plant.setLatitude(updated.getLatitude());
        if (updated.getLongitude() != null) plant.setLongitude(updated.getLongitude());
        if (updated.getAllowedRadiusMeter() != null) plant.setAllowedRadiusMeter(updated.getAllowedRadiusMeter());
        if (updated.getThresholdHours() != null) plant.setThresholdHours(updated.getThresholdHours());
        if (updated.getMainImageUrl() != null) plant.setMainImageUrl(updated.getMainImageUrl());
        if (updated.getCurrentStatus() != null) plant.setCurrentStatus(updated.getCurrentStatus());
        return ResponseEntity.ok(plantRepository.save(plant));
    }

    @DeleteMapping("/plants/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable Long id) {
        if (!plantRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        plantRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/plants/{id}/status")
    public ResponseEntity<Plant> changeStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Plant plant = plantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plant not found"));
        plant.setCurrentStatus(Status.valueOf(body.get("status")));
        return ResponseEntity.ok(plantRepository.save(plant));
    }

    // ===== Log Management =====

    @GetMapping("/logs")
    public ResponseEntity<List<PlantLog>> getAllLogs() {
        return ResponseEntity.ok(plantLogRepository.findAll());
    }

    @DeleteMapping("/logs/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        if (!plantLogRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        plantLogRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/logs/{id}/validation")
    public ResponseEntity<PlantLog> validateLog(@PathVariable Long id, @RequestBody Map<String, String> body) {
        PlantLog log = plantLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Log not found"));
        log.setValidationStatus(ValidationStatus.valueOf(body.get("status")));
        return ResponseEntity.ok(plantLogRepository.save(log));
    }
}
