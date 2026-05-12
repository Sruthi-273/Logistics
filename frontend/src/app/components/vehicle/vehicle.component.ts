import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Vehicle } from '../../models/index';

@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="section-title">Vehicle Management</h1>
        <button class="btn-primary" (click)="openForm()">+ Add Vehicle</button>
      </div>

      <!-- Form Modal -->
      <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ editingId ? 'Edit Vehicle' : 'Add New Vehicle' }}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Registration Number *</label>
              <input [(ngModel)]="form.registrationNumber" placeholder="e.g. TN01AB1234" />
            </div>
            <div class="form-group">
              <label>Type *</label>
              <select [(ngModel)]="form.type">
                <option value="">Select Type</option>
                <option>TRUCK</option><option>VAN</option><option>LORRY</option><option>MINI_TRUCK</option>
              </select>
            </div>
            <div class="form-group">
              <label>Brand *</label>
              <input [(ngModel)]="form.brand" placeholder="e.g. Tata, Ashok Leyland" />
            </div>
            <div class="form-group">
              <label>Model</label>
              <input [(ngModel)]="form.model" placeholder="e.g. 407" />
            </div>
            <div class="form-group">
              <label>Capacity (Tons)</label>
              <input type="number" [(ngModel)]="form.capacityTons" placeholder="e.g. 10" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="form.status">
                <option>AVAILABLE</option><option>IN_TRANSIT</option>
                <option>MAINTENANCE</option><option>INACTIVE</option>
              </select>
            </div>
            <div class="form-group">
              <label>Last Service Date</label>
              <input type="date" [(ngModel)]="form.lastServiceDate" />
            </div>
            <div class="form-group">
              <label>Next Service Date</label>
              <input type="date" [(ngModel)]="form.nextServiceDate" />
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
        <div *ngIf="loading" class="loading">Loading vehicles...</div>
        <div *ngIf="!loading && vehicles.length === 0" class="empty-state">No vehicles found. Add your first vehicle!</div>
        <table *ngIf="!loading && vehicles.length > 0" class="data-table">
          <thead>
            <tr>
              <th>Reg. Number</th><th>Type</th><th>Brand</th><th>Model</th>
              <th>Capacity</th><th>Status</th><th>Next Service</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let v of vehicles">
              <td><strong>{{ v.registrationNumber }}</strong></td>
              <td>{{ v.type }}</td>
              <td>{{ v.brand }}</td>
              <td>{{ v.model || '—' }}</td>
              <td>{{ v.capacityTons ? v.capacityTons + ' T' : '—' }}</td>
              <td><span class="badge" [ngClass]="v.status| lowercase">{{ v.status }}</span></td>
              <td>{{ v.nextServiceDate || '—' }}</td>
              <td class="actions">
                <button class="btn-edit" (click)="edit(v)">Edit</button>
                <button class="btn-delete" (click)="delete(v.id!)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .page { }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .section-title { font-size: 22px; font-weight: 700; color: #1f2937; margin: 0; }
    .btn-primary { background: #f97316; color: white; border: none; padding: 9px 18px; border-radius: 8px;
      cursor: pointer; font-weight: 600; font-size: 14px; }
    .btn-primary:hover { background: #ea6c0c; }
    .btn-secondary { background: #f3f4f6; color: #374151; border: none; padding: 9px 18px; border-radius: 8px;
      cursor: pointer; font-weight: 600; font-size: 14px; }

    .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
    .loading { text-align: center; padding: 40px; color: #6b7280; }
    .empty-state { color: #9ca3af; text-align: center; padding: 40px; }

    .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .data-table th { text-align: left; padding: 10px 12px; background: #f9fafb; color: #6b7280;
      font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .data-table td { padding: 12px; border-top: 1px solid #f3f4f6; color: #374151; }
    .data-table tr:hover td { background: #fafafa; }

    .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .badge.available { background: #d1fae5; color: #065f46; }
    .badge.in_transit { background: #fef3c7; color: #d97706; }
    .badge.maintenance { background: #fee2e2; color: #dc2626; }
    .badge.inactive { background: #f3f4f6; color: #6b7280; }

    .actions { display: flex; gap: 6px; }
    .btn-edit { background: #eff6ff; color: #3b82f6; border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; }
    .btn-delete { background: #fef2f2; color: #ef4444; border: none; padding: 5px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 600; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal { background: white; border-radius: 16px; padding: 28px; width: 560px; max-width: 95vw; box-shadow: 0 20px 60px rgba(0,0,0,0.2); }
    .modal h3 { margin: 0 0 20px; font-size: 18px; font-weight: 700; color: #1f2937; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 5px; }
    .form-group label { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; }
    .form-group input, .form-group select { padding: 9px 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 14px; outline: none; }
    .form-group input:focus, .form-group select:focus { border-color: #f97316; box-shadow: 0 0 0 3px rgba(249,115,22,0.1); }
    .modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
  `]
})
export class VehicleComponent implements OnInit {
  vehicles: Vehicle[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  form: Partial<Vehicle> = this.emptyForm();

  constructor(private api: ApiService) {}

  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getVehicles().subscribe({ next: v => { this.vehicles = v; this.loading = false; }, error: () => this.loading = false });
  }

  emptyForm(): Partial<Vehicle> {
    return { registrationNumber: '', type: '', brand: '', model: '', capacityTons: undefined, status: 'AVAILABLE' };
  }

  openForm() { this.form = this.emptyForm(); this.editingId = null; this.showForm = true; }
  closeForm() { this.showForm = false; }

  edit(v: Vehicle) {
    this.form = { ...v };
    this.editingId = v.id!;
    this.showForm = true;
  }

  save() {
    if (!this.form.registrationNumber || !this.form.type || !this.form.brand) {
      alert('Please fill required fields'); return;
    }
    const obs = this.editingId
      ? this.api.updateVehicle(this.editingId, this.form as Vehicle)
      : this.api.createVehicle(this.form as Vehicle);
    obs.subscribe({ next: () => { this.closeForm(); this.load(); }, error: (e) => alert('Error: ' + e.message) });
  }

  delete(id: number) {
    if (confirm('Delete this vehicle?')) {
      this.api.deleteVehicle(id).subscribe(() => this.load());
    }
  }
}
