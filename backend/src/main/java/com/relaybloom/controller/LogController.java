package com.relaybloom.controller;

import com.relaybloom.dto.PlantLogDto;
import com.relaybloom.service.PlantLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final PlantLogService plantLogService;

    @GetMapping("/{id}")
    public ResponseEntity<PlantLogDto> getLogById(@PathVariable Long id) {
        return ResponseEntity.ok(plantLogService.getLogById(id));
    }
}
