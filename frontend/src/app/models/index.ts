// models/vehicle.model.ts
export interface Vehicle {
  id?: number;
  registrationNumber: string;
  type: string;
  brand: string;
  model: string;
  capacityTons: number;
  status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE' | 'INACTIVE';
  lastServiceDate?: string;
  nextServiceDate?: string;
  driverAssigned?: string;
}

// models/driver.model.ts
export interface Driver {
  id?: number;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: 'AVAILABLE' | 'ON_TRIP' | 'OFF_DUTY' | 'INACTIVE';
  licenseExpiry?: string;
  totalTrips?: number;
  address?: string;
  joiningDate?: string;
}

// models/trip.model.ts
export interface Trip {
  id?: number;
  tripNumber?: string;
  vehicle?: Vehicle;
  driver?: Driver;
  origin: string;
  destination: string;
  scheduledDeparture?: string;
  actualDeparture?: string;
  scheduledArrival?: string;
  actualArrival?: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'DELAYED';
  distanceKm?: number;
  freightWeightTons?: number;
  cargoDescription?: string;
  clientName?: string;
  freightCost?: number;
  notes?: string;
}

// models/dashboard.model.ts
export interface DashboardStats {
  totalVehicles: number;
  availableVehicles: number;
  vehiclesInTransit: number;
  vehiclesInMaintenance: number;
  totalDrivers: number;
  availableDrivers: number;
  driversOnTrip: number;
  totalTrips: number;
  scheduledTrips: number;
  activeTrips: number;
  completedTrips: number;
  recentTrips: Trip[];
}
