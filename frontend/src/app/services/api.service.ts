import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, Driver, Trip, DashboardStats } from '../models/index';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/dashboard/stats`);
  }

  // Vehicles
  getVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles`);
  }
  getVehicle(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/vehicles/${id}`);
  }
  createVehicle(v: Vehicle): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.baseUrl}/vehicles`, v);
  }
  updateVehicle(id: number, v: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/vehicles/${id}`, v);
  }
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vehicles/${id}`);
  }

  // Drivers
  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(`${this.baseUrl}/drivers`);
  }
  getDriver(id: number): Observable<Driver> {
    return this.http.get<Driver>(`${this.baseUrl}/drivers/${id}`);
  }
  createDriver(d: Driver): Observable<Driver> {
    return this.http.post<Driver>(`${this.baseUrl}/drivers`, d);
  }
  updateDriver(id: number, d: Driver): Observable<Driver> {
    return this.http.put<Driver>(`${this.baseUrl}/drivers/${id}`, d);
  }
  deleteDriver(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/drivers/${id}`);
  }

  // Trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }
  getTrip(id: number): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/trips/${id}`);
  }
  createTrip(t: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.baseUrl}/trips`, t);
  }
  updateTrip(id: number, t: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/trips/${id}`, t);
  }
  deleteTrip(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/trips/${id}`);
  }
}
