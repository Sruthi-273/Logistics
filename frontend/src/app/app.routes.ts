import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'vehicles',
    loadComponent: () =>
      import('./components/vehicle/vehicle.component').then(m => m.VehicleComponent)
  },
  {
    path: 'drivers',
    loadComponent: () =>
      import('./components/driver/driver.component').then(m => m.DriverComponent)
  },
  {
    path: 'trips',
    loadComponent: () =>
      import('./components/trip/trip.component').then(m => m.TripComponent)
  }
];
