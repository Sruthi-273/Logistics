package com.tms.controller;

import com.tms.model.Trip;
import com.tms.service.TripService;
import com.tms.service.VehicleService;
import com.tms.service.DriverService;
import com.tms.model.Vehicle;
import com.tms.model.Driver;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TripController {

    private final TripService tripService;
    private final VehicleService vehicleService;
    private final DriverService driverService;

    @GetMapping("/trips")
    public List<Trip> getAllTrips() {
        return tripService.getAllTrips();
    }

    @GetMapping("/trips/{id}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long id) {
        return ResponseEntity.ok(tripService.getTripById(id));
    }

    @PostMapping("/trips")
    public ResponseEntity<Trip> createTrip(@RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.createTrip(trip));
    }

    @PutMapping("/trips/{id}")
    public ResponseEntity<Trip> updateTrip(@PathVariable Long id, @RequestBody Trip trip) {
        return ResponseEntity.ok(tripService.updateTrip(id, trip));
    }

    @DeleteMapping("/trips/{id}")
    public ResponseEntity<Void> deleteTrip(@PathVariable Long id) {
        tripService.deleteTrip(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalVehicles", vehicleService.getAllVehicles().size());
        stats.put("availableVehicles", vehicleService.countByStatus(Vehicle.VehicleStatus.AVAILABLE));
        stats.put("vehiclesInTransit", vehicleService.countByStatus(Vehicle.VehicleStatus.IN_TRANSIT));
        stats.put("vehiclesInMaintenance", vehicleService.countByStatus(Vehicle.VehicleStatus.MAINTENANCE));

        stats.put("totalDrivers", driverService.getAllDrivers().size());
        stats.put("availableDrivers", driverService.countByStatus(Driver.DriverStatus.AVAILABLE));
        stats.put("driversOnTrip", driverService.countByStatus(Driver.DriverStatus.ON_TRIP));

        stats.put("totalTrips", tripService.getAllTrips().size());
        stats.put("scheduledTrips", tripService.countByStatus(Trip.TripStatus.SCHEDULED));
        stats.put("activeTrips", tripService.countByStatus(Trip.TripStatus.IN_PROGRESS));
        stats.put("completedTrips", tripService.countByStatus(Trip.TripStatus.COMPLETED));

        stats.put("recentTrips", tripService.getAllTrips().stream().limit(5).toList());

        return ResponseEntity.ok(stats);
    }
}
