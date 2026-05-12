package com.tms.service;

import com.tms.model.Driver;
import com.tms.repository.DriverRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverService {

    private final DriverRepository driverRepository;

    public List<Driver> getAllDrivers() {
        return driverRepository.findAll();
    }

    public Driver getDriverById(Long id) {
        return driverRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Driver not found with id: " + id));
    }

    public Driver createDriver(Driver driver) {
        return driverRepository.save(driver);
    }

    public Driver updateDriver(Long id, Driver driverDetails) {
        Driver driver = getDriverById(id);
        driver.setName(driverDetails.getName());
        driver.setLicenseNumber(driverDetails.getLicenseNumber());
        driver.setPhone(driverDetails.getPhone());
        driver.setEmail(driverDetails.getEmail());
        driver.setStatus(driverDetails.getStatus());
        driver.setLicenseExpiry(driverDetails.getLicenseExpiry());
        driver.setAddress(driverDetails.getAddress());
        return driverRepository.save(driver);
    }

    public void deleteDriver(Long id) {
        driverRepository.deleteById(id);
    }

    public List<Driver> getAvailableDrivers() {
        return driverRepository.findByStatus(Driver.DriverStatus.AVAILABLE);
    }

    public long countByStatus(Driver.DriverStatus status) {
        return driverRepository.countByStatus(status);
    }
}
