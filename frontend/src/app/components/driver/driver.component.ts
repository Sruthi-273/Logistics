import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Driver } from '../../models/index';

@Component({
  selector: 'app-driver',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="page-header">
        <h1 class="section-title">Driver Management</h1>
        <button class="btn-primary" (click)="openForm()">+ Add Driver</button>
      </div>

      <!-- Form Modal -->
      <div class="modal-overlay" *ngIf="showForm" (click)="closeForm()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ editingId ? 'Edit Driver' : 'Add New Driver' }}</h3>
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name *</label>
              <input [(ngModel)]="form.name" placeholder="Driver name" />
            </div>
            <div class="form-group">
              <label>License Number *</label>
              <input [(ngModel)]="form.licenseNumber" placeholder="e.g. TN0120230001234" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input [(ngModel)]="form.phone" placeholder="+91 9876543210" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input [(ngModel)]="form.email" placeholder="driver@email.com" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="form.status">
                <option>AVAILABLE</option><option>ON_TRIP</option>
                <option>OFF_DUTY</option><option>INACTIVE</option>
              </select>
            </div>
            <div class="form-group">
              <label>License Expiry</label>
              <input type="date" [(ngModel)]="form.licenseExpiry" />
            </div>
            <div class="form-group" style="grid-column: 1 / -1;">
              <label>Address</label>
              <input [(ngModel)]="form.address" placeholder="Full address" />
            </div>
            <div class="form-group">
              <label>Joining Date</label>
              <input type="date" [(ngModel)]="form.joiningDate" />
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
        <div *ngIf="loading" class="loading">Loading drivers...</div>
        <div *ngIf="!loading && drivers.length === 0" class="empty-state">No drivers found. Add your first driver!</div>
        <table *ngIf="!loading && drivers.length > 0" class="data-table">
          <thead>
            <tr>
              <th>Name</th><th>License</th><th>Phone</th><th>Email</th>
              <th>Status</th><th>Total Trips</th><th>License Expiry</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let d of drivers">
              <td><strong>{{ d.name }}</strong></td>
              <td><code>{{ d.licenseNumber }}</code></td>
              <td>{{ d.phone || '—' }}</td>
              <td>{{ d.email || '—' }}</td>
              <td><span class="badge" [ngClass]="d.status| lowercase">{{ d.status }}</span></td>
              <td>{{ d.totalTrips || 0 }}</td>
              <td>{{ d.licenseExpiry || '—' }}</td>
              <td class="actions">
                <button class="btn-edit" (click)="edit(d)">Edit</button>
                <button class="btn-delete" (click)="delete(d.id!)">Delete</button>
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
    .data-table { width: 100%; border-collapse: collapse; font-size: 14px; }
    .data-table th { text-align: left; padding: 10px 12px; background: #f9fafb; color: #6b7280; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .data-table td { padding: 12px; border-top: 1px solid #f3f4f6; color: #374151; }
    .data-table tr:hover td { background: #fafafa; }
    code { background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px; }
    .badge { padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
    .badge.available { background: #d1fae5; color: #065f46; }
    .badge.on_trip { background: #fef3c7; color: #d97706; }
    .badge.off_duty { background: #f3f4f6; color: #6b7280; }
    .badge.inactive { background: #fee2e2; color: #dc2626; }
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
export class DriverComponent implements OnInit {
  drivers: Driver[] = [];
  loading = true;
  showForm = false;
  editingId: number | null = null;
  form: Partial<Driver> = this.emptyForm();

  constructor(private api: ApiService) {}
  ngOnInit() { this.load(); }

  load() {
    this.loading = true;
    this.api.getDrivers().subscribe({ next: d => { this.drivers = d; this.loading = false; }, error: () => this.loading = false });
  }

  emptyForm(): Partial<Driver> {
    return { name: '', licenseNumber: '', phone: '', email: '', status: 'AVAILABLE' };
  }

  openForm() { this.form = this.emptyForm(); this.editingId = null; this.showForm = true; }
  closeForm() { this.showForm = false; }

  edit(d: Driver) { this.form = { ...d }; this.editingId = d.id!; this.showForm = true; }

  save() {
    if (!this.form.name || !this.form.licenseNumber) { alert('Please fill required fields'); return; }
    const obs = this.editingId
      ? this.api.updateDriver(this.editingId, this.form as Driver)
      : this.api.createDriver(this.form as Driver);
    obs.subscribe({ next: () => { this.closeForm(); this.load(); }, error: (e) => alert('Error: ' + e.message) });
  }

  delete(id: number) {
    if (confirm('Delete this driver?')) this.api.deleteDriver(id).subscribe(() => this.load());
  }
}
