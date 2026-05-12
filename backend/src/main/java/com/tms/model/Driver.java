package com.tms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "drivers")
public class Driver {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    @Column(unique = true)
    private String licenseNumber;

    private String phone;

    private String email;

    @Enumerated(EnumType.STRING)
    private DriverStatus status = DriverStatus.AVAILABLE;

    private LocalDate licenseExpiry;

    private Integer totalTrips = 0;

    private String address;

    private LocalDate joiningDate;

    public enum DriverStatus {
        AVAILABLE, ON_TRIP, OFF_DUTY, INACTIVE
    }
}
