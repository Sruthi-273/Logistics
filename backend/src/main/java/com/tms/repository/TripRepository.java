package com.tms.repository;

import com.tms.model.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Long> {
    List<Trip> findByStatus(Trip.TripStatus status);
    List<Trip> findByDriverId(Long driverId);
    List<Trip> findByVehicleId(Long vehicleId);
    long countByStatus(Trip.TripStatus status);
}
