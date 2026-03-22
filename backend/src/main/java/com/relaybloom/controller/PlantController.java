package com.relaybloom.controller;

import com.relaybloom.dto.PlantDto;
import com.relaybloom.dto.PlantLogDto;
import com.relaybloom.dto.PlantLogRequest;
import com.relaybloom.service.PlantLogService;
import com.relaybloom.service.PlantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/plants")
@RequiredArgsConstructor
public class PlantController {

    private final PlantService plantService;
    private final PlantLogService plantLogService;

    @GetMapping
    public ResponseEntity<List<PlantDto>> getAllPlants() {
        return ResponseEntity.ok(plantService.getAllPlants());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlantDto> getPlantById(@PathVariable Long id) {
        return ResponseEntity.ok(plantService.getPlantById(id));
    }

    @GetMapping("/{id}/logs")
    public ResponseEntity<List<PlantLogDto>> getLogsByPlantId(@PathVariable Long id) {
        return ResponseEntity.ok(plantLogService.getLogsByPlantId(id));
    }

    @PostMapping("/{id}/logs")
    public ResponseEntity<PlantLogDto> createLog(@PathVariable Long id, @RequestBody PlantLogRequest request) {
        return ResponseEntity.ok(plantLogService.createLog(id, request));
    }
}
