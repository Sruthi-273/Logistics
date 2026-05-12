package com.tms.service;

import com.tms.model.Driver;
import com.tms.model.Trip;
import com.tms.model.Vehicle;
import com.tms.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TripService {

    private final TripRepository tripRepository;
    private final VehicleService vehicleService;
    private final DriverService driverService;

    public List<Trip> getAllTrips() {
        return tripRepository.findAll();
    }

    public Trip getTripById(Long id) {
        return tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip not found with id: " + id));
    }

    public Trip createTrip(Trip trip) {
        trip.setTripNumber("TRP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        // Update vehicle and driver status
        if (trip.getVehicle() != null) {
            Vehicle v = vehicleService.getVehicleById(trip.getVehicle().getId());
            v.setStatus(Vehicle.VehicleStatus.IN_TRANSIT);
            vehicleService.updateVehicle(v.getId(), v);
        }
        if (trip.getDriver() != null) {
            Driver d = driverService.getDriverById(trip.getDriver().getId());
            d.setStatus(Driver.DriverStatus.ON_TRIP);
            driverService.updateDriver(d.getId(), d);
        }
        return tripRepository.save(trip);
    }

    public Trip updateTrip(Long id, Trip tripDetails) {
        Trip trip = getTripById(id);
        trip.setOrigin(tripDetails.getOrigin());
        trip.setDestination(tripDetails.getDestination());
        trip.setScheduledDeparture(tripDetails.getScheduledDeparture());
        trip.setActualDeparture(tripDetails.getActualDeparture());
        trip.setScheduledArrival(tripDetails.getScheduledArrival());
        trip.setActualArrival(tripDetails.getActualArrival());
        trip.setStatus(tripDetails.getStatus());
        trip.setDistanceKm(tripDetails.getDistanceKm());
        trip.setFreightWeightTons(tripDetails.getFreightWeightTons());
        trip.setCargoDescription(tripDetails.getCargoDescription());
        trip.setClientName(tripDetails.getClientName());
        trip.setFreightCost(tripDetails.getFreightCost());
        trip.setNotes(tripDetails.getNotes());

        // Free up vehicle/driver if completed or cancelled
        if (tripDetails.getStatus() == Trip.TripStatus.COMPLETED ||
            tripDetails.getStatus() == Trip.TripStatus.CANCELLED) {
            if (trip.getVehicle() != null) {
                Vehicle v = vehicleService.getVehicleById(trip.getVehicle().getId());
                v.setStatus(Vehicle.VehicleStatus.AVAILABLE);
                vehicleService.updateVehicle(v.getId(), v);
            }
            if (trip.getDriver() != null) {
                Driver d = driverService.getDriverById(trip.getDriver().getId());
                d.setStatus(Driver.DriverStatus.AVAILABLE);
                d.setTotalTrips(d.getTotalTrips() + 1);
                driverService.updateDriver(d.getId(), d);
            }
            if (tripDetails.getStatus() == Trip.TripStatus.COMPLETED) {
                trip.setActualArrival(LocalDateTime.now());
            }
        }
        return tripRepository.save(trip);
    }

    public void deleteTrip(Long id) {
        tripRepository.deleteById(id);
    }

    public List<Trip> getTripsByStatus(Trip.TripStatus status) {
        return tripRepository.findByStatus(status);
    }

    public long countByStatus(Trip.TripStatus status) {
        return tripRepository.countByStatus(status);
    }
}
