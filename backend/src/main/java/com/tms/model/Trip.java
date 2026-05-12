package com.tms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "trips")
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String tripNumber;

    @ManyToOne
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @NotBlank
    private String origin;

    @NotBlank
    private String destination;

    private LocalDateTime scheduledDeparture;

    private LocalDateTime actualDeparture;

    private LocalDateTime scheduledArrival;

    private LocalDateTime actualArrival;

    @Enumerated(EnumType.STRING)
    private TripStatus status = TripStatus.SCHEDULED;

    private Double distanceKm;

    private Double freightWeightTons;

    private String cargoDescription;

    private String clientName;

    private Double freightCost;

    private String notes;

    public enum TripStatus {
        SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, DELAYED
    }
}
