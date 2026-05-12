import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Trip, Vehicle, Driver } from '../../models/index';

@Component({
  selector: 'app-trip',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="section-title">Trip Management</h1>
        <button class="btn-primary" (click)="openForm()">+ New Trip</button>
      </div>

      <!-- Form Modal -->
      <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ editingId ? 'Edit Trip' : 'Create New Trip' }}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Origin *</label>
              <input [(ngModel)]="form.origin" placeholder="Departure city" />
            </div>
            <div class="form-group">
              <label>Destination *</label>
              <input [(ngModel)]="form.destination" placeholder="Arrival city" />
            </div>
            <div class="form-group">
              <label>Vehicle</label>
              <select [(ngModel)]="selectedVehicleId">
                <option value="">Select Vehicle</option>
                <option *ngFor="let v of vehicles" [value]="v.id">{{ v.registrationNumber }} ({{ v.type }})</option>
              </select>
            </div>
            <div class="form-group">
              <label>Driver</label>
              <select [(ngModel)]="selectedDriverId">
                <option value="">Select Driver</option>
                <option *ngFor="let d of drivers" [value]="d.id">{{ d.name }}</option>
              </select>
            </div>
            <div class="form-group">
              <label>Client Name</label>
              <input [(ngModel)]="form.clientName" placeholder="Client / company" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="form.status">
                <option>SCHEDULED</option><option>IN_PROGRESS</option>
                <option>COMPLETED</option><option>CANCELLED</option><option>DELAYED</option>
              </select>
            </div>
            <div class="form-group">
              <label>Scheduled Departure</label>
              <input type="datetime-local" [(ngModel)]="form.scheduledDeparture" />
            </div>
            <div class="form-group">
              <label>Scheduled Arrival</label>
              <input type="datetime-local" [(ngModel)]="form.scheduledArrival" />
            </div>
            <div class="form-group">
              <label>Distance (KM)</label>
              <input type="number" [(ngModel)]="form.distanceKm" placeholder="e.g. 500" />
            </div>
            <div class="form-group">
              <label>Freight Weight (Tons)</label>
              <input type="number" [(ngModel)]="form.freightWeightTons" placeholder="e.g. 5" />
            </div>
            <div class="form-group">
              <label>Freight Cost (₹)</label>
              <input type="number" [(ngModel)]="form.freightCost" placeholder="e.g. 15000" />
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Cargo Description</label>
              <input [(ngModel)]="form.cargoDescription" placeholder="What is being transported?" />
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Notes</label>
              <input [(ngModel)]="form.notes" placeholder="Any special instructions" />
            </div>
          </div>
          <div class="modal-actions">
            <button class="btn-secondary" (click)="closeForm()">Cancel</button>
            <button class="btn-primary" (click)="save()">{{ editingId ? 'Update' : 'Create' }}</button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="card">
        <div *ngIf="loading" class="loading">Loading trips...</div>
        <div *ngIf="!loading && trips.length === 0" class="empty-state">No trips found. Create your first trip!</div>
        <table *ngIf="!loading && trips.length > 0" class="data-table">
          <thead>
            <tr>
              <th>Trip #</th><th>Route</th><th>Vehicle</th><th>Driver</th>
              <th>Client</th><th>Status</th><th>Distance</th><th>Cost</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of trips">
              <td><code>{{ t.tripNumber }}</code></td>
              <td><strong>{{ t.origin }}</strong> → {{ t.destination }}</td>
              <td>{{ t.vehicle?.registrationNumber || '—' }}</td>
              <td>{{ t.driver?.name || '—' }}</td>
              <td>{{ t.clientName || '—' }}</td>
              <td><span class="badge" [ngClass]="t.status| lowercase">{{ t.status }}</span></td>
              <td>{{ t.distanceKm ? t.distanceKm + ' km' : '—' }}</td>
              <td>{{ t.freightCost ? '₹' + t.freightCost : '—' }}</td>
              <td class="actions">
                <button class="btn-edit" (click)="edit(t)">Edit</button>
                <button class="btn-delete" (click)="delete(t.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-title { font-size: 22px; font-weight: 700; color: #1f2937; margin: 0; }
    .btn-primary { background: #f97316; color: white; border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; }
    .btn-primary:hover { background: #ea6c0c; }
    .btn-secondary { background: #f3f4f6; color: #374151; border: none; padding: 9px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 14px; }
    .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
    .loading, .empty-state { text-align: center; padding: 40px; color: #9ca3af; }
    .data-table { width: 100%; border-collapse: collapse; font-size: 13px; }
    .data-table th { text-align: left; padding: 10px 10px; background: #f9fafb; color: #6b7280; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .data-table td { padding: 11px 10px; border-top: 1px solid #f3f4f6; color: #374151; }
    .data-table tr:hover td { background: #fafafa; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 11px; }
    .badge { padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 600; text-transform: uppercase; white-space: nowrap; }
    .badge.scheduled { background: #dbeafe; color: #1d4ed8; }
    .badge.in_progress { background: #fef3c7; color: #d97706; }
    .badge.completed { background: #d1fae5; color: #065f46; }
    .badge.cancelled { background: #fee2e2; color: #dc2626; }
    .badge.delayed { background: #fce7f3; color: #be185d; }
    .actions { display: flex; gap: 6px; }
    .btn-edit { background: #eff6ff; color: #3b82f6; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; }
    .btn-delete { background: #fef2f2; color: #ef4444; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px; font-weight: 600; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 16px; padding: 28px; width: 620px; max-width: 95vw; max-height: 90vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
    .modal h3 { margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #1f2937; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .form-group label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; }
    .form-group input, .form-group select { padding: 9px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
    .form-group input:focus, .form-group select:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
  `]
})
export class TripComponent implements OnInit {
  trips: Trip[] = [];
  vehicles: Vehicle[] = [];
  drivers: Driver[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  form: Partial<Trip> = this.emptyForm();
  selectedVehicleId: string = '';
  selectedDriverId: string = '';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.load();
    this.api.getVehicles().subscribe(v => this.vehicles = v);
    this.api.getDrivers().subscribe(d => this.drivers = d);
  }

  load() {
    this.loading = true;
    this.api.getTrips().subscribe({ next: t => { this.trips = t; this.loading = false; }, error: () => this.loading = false });
  }

  emptyForm(): Partial<Trip> {
    return { origin: '', destination: '', status: 'SCHEDULED' };
  }

  openForm() { this.form = this.emptyForm(); this.editingId = null; this.selectedVehicleId = ''; this.selectedDriverId = ''; this.showForm = true; }
  closeForm() { this.showForm = false; }

  edit(t: Trip) {
    this.form = { ...t };
    this.editingId = t.id!;
    this.selectedVehicleId = t.vehicle?.id?.toString() || '';
    this.selectedDriverId = t.driver?.id?.toString() || '';
    this.showForm = true;
  }

  save() {
    if (!this.form.origin || !this.form.destination) { alert('Origin and Destination are required'); return; }
    const payload: any = { ...this.form };
    if (this.selectedVehicleId) payload.vehicle = { id: +this.selectedVehicleId };
    if (this.selectedDriverId) payload.driver = { id: +this.selectedDriverId };

    const obs = this.editingId
      ? this.api.updateTrip(this.editingId, payload)
      : this.api.createTrip(payload);
    obs.subscribe({ next: () => { this.closeForm(); this.load(); }, error: (e) => alert('Error: ' + e.message) });
  }

  delete(id: number) {
    if (confirm('Delete this trip?')) this.api.deleteTrip(id).subscribe(() => this.load());
  }
}
