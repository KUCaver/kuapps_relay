package com.relaybloom.controller;

import com.relaybloom.entity.Plant;
import com.relaybloom.repository.PlantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/plants")
@RequiredArgsConstructor
public class AdminController {

    private final PlantRepository plantRepository;

    @PostMapping
    public ResponseEntity<Plant> createPlant(@RequestBody Plant plant) {
        // MVP: Simple create
        return ResponseEntity.ok(plantRepository.save(plant));
    }
}
