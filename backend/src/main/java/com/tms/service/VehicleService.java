package com.tms.service;

import com.tms.model.Vehicle;
import com.tms.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found with id: " + id));
    }

    public Vehicle createVehicle(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, Vehicle vehicleDetails) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setRegistrationNumber(vehicleDetails.getRegistrationNumber());
        vehicle.setType(vehicleDetails.getType());
        vehicle.setBrand(vehicleDetails.getBrand());
        vehicle.setModel(vehicleDetails.getModel());
        vehicle.setCapacityTons(vehicleDetails.getCapacityTons());
        vehicle.setStatus(vehicleDetails.getStatus());
        vehicle.setLastServiceDate(vehicleDetails.getLastServiceDate());
        vehicle.setNextServiceDate(vehicleDetails.getNextServiceDate());
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }

    public List<Vehicle> getAvailableVehicles() {
        return vehicleRepository.findByStatus(Vehicle.VehicleStatus.AVAILABLE);
    }

    public long countByStatus(Vehicle.VehicleStatus status) {
        return vehicleRepository.countByStatus(status);
    }
}
