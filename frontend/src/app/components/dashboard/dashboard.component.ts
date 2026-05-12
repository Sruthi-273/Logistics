import { Component, OnInit } from '@angular/core';
import { CommonModule, LowerCasePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { DashboardStats } from '../../models/index';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LowerCasePipe],
  template: `
    <div class="dashboard">
      <h1 class="section-title">Dashboard Overview</h1>

      <div *ngIf="loading" class="loading">Loading stats...</div>

      <div *ngIf="!loading && stats">
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="stat-card vehicles">
            <div class="stat-icon">🚚</div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalVehicles }}</div>
              <div class="stat-label">Total Vehicles</div>
              <div class="stat-sub">{{ stats.availableVehicles }} available · {{ stats.vehiclesInTransit }} in transit</div>
            </div>
          </div>
          <div class="stat-card drivers">
            <div class="stat-icon">👤</div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalDrivers }}</div>
              <div class="stat-label">Total Drivers</div>
              <div class="stat-sub">{{ stats.availableDrivers }} available · {{ stats.driversOnTrip }} on trip</div>
            </div>
          </div>
          <div class="stat-card trips">
            <div class="stat-icon">🗺️</div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalTrips }}</div>
              <div class="stat-label">Total Trips</div>
              <div class="stat-sub">{{ stats.activeTrips }} active · {{ stats.scheduledTrips }} scheduled</div>
            </div>
          </div>
          <div class="stat-card completed">
            <div class="stat-icon">✅</div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.completedTrips }}</div>
              <div class="stat-label">Completed Trips</div>
              <div class="stat-sub">Successfully delivered</div>
            </div>
          </div>
        </div>

        <!-- Recent Trips -->
        <div class="section-card">
          <h3 class="card-title">Recent Trips</h3>
          <div *ngIf="!stats.recentTrips || stats.recentTrips.length === 0" class="empty-state">No trips yet. Create your first trip!</div>
          <table *ngIf="stats.recentTrips && stats.recentTrips.length > 0" class="data-table">
            <thead>
              <tr>
                <th>Trip #</th>
                <th>Route</th>
                <th>Driver</th>
                <th>Status</th>
                <th>Client</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let trip of stats.recentTrips">
                <td><code>{{ trip.tripNumber }}</code></td>
                <td>{{ trip.origin }} → {{ trip.destination }}</td>
                <td>{{ trip.driver?.name || '—' }}</td>
                <td><span class="badge" [ngClass]="(trip.status | lowercase)">{{ trip.status }}</span></td>
                <td>{{ trip.clientName || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .section-title { font-size: 22px; font-weight: 700; color: #1f2937; margin: 0 0 20px; }
    .loading { text-align: center; padding: 40px; color: #6b7280; }

    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { background: white; border-radius: 12px; padding: 20px; display: flex; gap: 16px;
      align-items: center; box-shadow: 0 1px 4px rgba(0,0,0,0.07); border-left: 4px solid #e5e7eb; }
    .stat-card.vehicles { border-left-color: #3b82f6; }
    .stat-card.drivers { border-left-color: #10b981; }
    .stat-card.trips { border-left-color: #f97316; }
    .stat-card.completed { border-left-color: #8b5cf6; }
    .stat-icon { font-size: 32px; }
    .stat-value { font-size: 28px; font-weight: 700; color: #1f2937; line-height: 1; }
    .stat-label { font-size: 13px; font-weight: 600; color: #6b7280; margin: 4px 0 2px; }
    .stat-sub { font-size: 11px; color: #9ca3af; }

    .section-card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
    .card-title { font-size: 16px; font-weight: 600; color: #1f2937; margin: 0 0 16px; }
    .empty-state { color: #9ca3af; text-align: center; padding: 24px; font-size: 14px; }

    .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .data-table th { text-align: left; padding: 10px 12px; background: #f9fafb; color: #6b7280;
      font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .data-table td { padding: 12px; border-top: 1px solid #f3f4f6; color: #374151; }
    .data-table tr:hover td { background: #fafafa; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; }

    .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .badge.scheduled { background: #dbeafe; color: #1d4ed8; }
    .badge.in_progress { background: #fef3c7; color: #d97706; }
    .badge.completed { background: #d1fae5; color: #065f46; }
    .badge.cancelled { background: #fee2e2; color: #dc2626; }
    .badge.delayed { background: #fce7f3; color: #be185d; }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.apiService.getDashboardStats().subscribe({
      next: (data) => { this.stats = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }
}