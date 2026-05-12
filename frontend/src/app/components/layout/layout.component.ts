import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  template: `
    <div class="app-container">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <div class="logo">
            <span class="logo-icon">🚛</span>
            <span class="logo-text">TMS</span>
          </div>
          <p class="logo-sub">Transport Management</p>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">📊</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/vehicles" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🚚</span>
            <span>Vehicles</span>
          </a>
          <a routerLink="/drivers" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">👤</span>
            <span>Drivers</span>
          </a>
          <a routerLink="/trips" routerLinkActive="active" class="nav-item">
            <span class="nav-icon">🗺️</span>
            <span>Trips</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <span>v1.0.0</span>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="top-bar">
          <h2 class="page-title">Transport Management System</h2>
          <div class="top-bar-right">
            <span class="status-badge online">● System Online</span>
          </div>
        </header>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-container { display: flex; height: 100vh; background: #f0f2f5; font-family: 'Segoe UI', sans-serif; }

    .sidebar { width: 240px; background: linear-gradient(180deg, #1a1f3a 0%, #0d1117 100%);
      color: white; display: flex; flex-direction: column; padding: 0; flex-shrink: 0; }

    .sidebar-header { padding: 24px 20px 16px; border-bottom: 1px solid rgba(255,255,255,0.08); }
    .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 4px; }
    .logo-icon { font-size: 28px; }
    .logo-text { font-size: 22px; font-weight: 700; color: #f97316; letter-spacing: 1px; }
    .logo-sub { font-size: 11px; color: rgba(255,255,255,0.4); margin: 0; text-transform: uppercase; letter-spacing: 1px; }

    .sidebar-nav { flex: 1; padding: 16px 12px; display: flex; flex-direction: column; gap: 4px; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 14px; border-radius: 8px;
      color: rgba(255,255,255,0.6); text-decoration: none; transition: all 0.2s; font-size: 14px; font-weight: 500; }
    .nav-item:hover { background: rgba(255,255,255,0.08); color: white; }
    .nav-item.active { background: rgba(249,115,22,0.2); color: #f97316; }
    .nav-icon { font-size: 18px; width: 22px; text-align: center; }

    .sidebar-footer { padding: 16px 20px; font-size: 11px; color: rgba(255,255,255,0.2); border-top: 1px solid rgba(255,255,255,0.06); }

    .main-content { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
    .top-bar { background: white; padding: 14px 28px; display: flex; justify-content: space-between;
      align-items: center; border-bottom: 1px solid #e5e7eb; box-shadow: 0 1px 4px rgba(0,0,0,0.06); }
    .page-title { margin: 0; font-size: 16px; font-weight: 600; color: #1f2937; }
    .status-badge { font-size: 12px; color: #10b981; background: #d1fae5; padding: 4px 10px; border-radius: 20px; font-weight: 500; }
    .content-area { flex: 1; overflow-y: auto; padding: 24px; }
  `]
})
export class LayoutComponent {}
