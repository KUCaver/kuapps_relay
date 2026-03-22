package com.relaybloom.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "plant_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlantLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_id", nullable = false)
    private Plant plant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    private Double latitude;

    private Double longitude;

    private Boolean watered;

    private Boolean isHealthy;

    private Boolean hasIssue;

    @Column(length = 255)
    private String issueNote;

    @Column(length = 255)
    private String relayMessage;

    private Integer guardianOrder;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private ValidationStatus validationStatus = ValidationStatus.PENDING;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
