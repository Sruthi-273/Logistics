package com.tms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "vehicles")
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String registrationNumber;

    @NotBlank
    private String type; // TRUCK, VAN, LORRY, MINI_TRUCK

    @NotBlank
    private String brand;

    private String model;

    private Double capacityTons;

    @Enumerated(EnumType.STRING)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    private LocalDate lastServiceDate;

    private LocalDate nextServiceDate;

    private String driverAssigned;

    public enum VehicleStatus {
        AVAILABLE, IN_TRANSIT, MAINTENANCE, INACTIVE
    }
}
