package com.relaybloom.repository;

import com.relaybloom.entity.PlantLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlantLogRepository extends JpaRepository<PlantLog, Long> {
    List<PlantLog> findByPlantIdOrderByCreatedAtDesc(Long plantId);
    int countByPlantId(Long plantId);
}
