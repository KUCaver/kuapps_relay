package com.relaybloom.controller;

import com.relaybloom.dto.PlantDto;
import com.relaybloom.dto.PlantLogDto;
import com.relaybloom.entity.Plant;
import com.relaybloom.entity.Status;
import com.relaybloom.entity.ValidationStatus;
import com.relaybloom.repository.PlantLogRepository;
import com.relaybloom.service.PlantLogService;
import com.relaybloom.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final PlantService plantService;
    private final PlantLogService plantLogService;

    // ===== Plant CRUD =====

    @PostMapping("/plants")
    public ResponseEntity<PlantDto> createPlant(@RequestBody Plant plant) {
        return ResponseEntity.ok(plantService.createPlant(plant));
    }

    @PutMapping("/plants/{id}")
    public ResponseEntity<PlantDto> updatePlant(@PathVariable Long id, @RequestBody Plant updated) {
        return ResponseEntity.ok(plantService.updatePlant(id, updated));
    }

    @DeleteMapping("/plants/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable Long id) {
        plantService.deletePlant(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/plants/{id}/status")
    public ResponseEntity<PlantDto> changeStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Status status = Status.valueOf(body.get("status"));
        return ResponseEntity.ok(plantService.changeStatus(id, status));
    }

    // ===== Log Management =====

    @DeleteMapping("/logs/{id}")
    public ResponseEntity<Void> deleteLog(@PathVariable Long id) {
        plantLogService.deleteLog(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/logs/{id}/validation")
    public ResponseEntity<PlantLogDto> validateLog(@PathVariable Long id, @RequestBody Map<String, String> body) {
        ValidationStatus status = ValidationStatus.valueOf(body.get("status"));
        return ResponseEntity.ok(plantLogService.validateLog(id, status));
    }
}
