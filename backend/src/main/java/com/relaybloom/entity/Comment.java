package com.relaybloom.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "comments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "plant_log_id", nullable = false)
    private PlantLog plantLog;

    @Column(nullable = false, length = 50)
    private String nickname;

    @Column(nullable = false, length = 300)
    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private OffsetDateTime createdAt;
}
