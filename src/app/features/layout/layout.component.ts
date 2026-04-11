// src/app/features/layout/layout.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="app-layout">
      <aside class="sidebar" [class.collapsed]="sidebarCollapsed">
        <div class="sidebar-header">
          <div class="logo" routerLink="/dashboard">🏭 GMAO Bontaz</div>
          <button class="toggle-btn" (click)="toggleSidebar()">{{ sidebarCollapsed ? '→' : '←' }}</button>
        </div>
        <nav>
          <a routerLink="/dashboard" routerLinkActive="active">📊 Tableau de bord</a>
          <a *ngIf="isAdmin" routerLink="/admin/users" routerLinkActive="active">👥 Utilisateurs</a>
          <a routerLink="/profile" routerLinkActive="active">👤 Mon profil</a>
        </nav>
        <div class="sidebar-footer">
          <div class="user-info" *ngIf="!sidebarCollapsed">
            <div>{{ username }}</div>
            <small>{{ role }}</small>
          </div>
          <button class="logout-btn" (click)="logout()">🚪 Déconnexion</button>
        </div>
      </aside>
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout { display: flex; height: 100vh; }
    .sidebar { width: 260px; background: linear-gradient(180deg, #012738, #01161a); color: white; transition: width 0.3s; display: flex; flex-direction: column; }
    .sidebar.collapsed { width: 70px; }
    .sidebar-header { display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid rgba(255,255,255,0.1); }
    .logo { cursor: pointer; font-weight: bold; }
    .toggle-btn { background: none; border: none; color: white; cursor: pointer; }
    nav { flex: 1; padding: 20px 0; }
    nav a { display: flex; align-items: center; gap: 12px; padding: 12px 20px; color: rgba(255,255,255,0.8); text-decoration: none; transition: 0.3s; }
    nav a:hover, nav a.active { background: rgba(255,255,255,0.1); color: white; }
    .sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.1); }
    .user-info { margin-bottom: 15px; }
    .logout-btn { width: 100%; background: #dc3545; border: none; padding: 10px; color: white; border-radius: 6px; cursor: pointer; }
    .main-content { flex: 1; background: #f5f7fa; overflow: auto; }
  `]
})
export class LayoutComponent {
  sidebarCollapsed = false;
  isAdmin = false;
  username = '';
  role = '';
  constructor(private authService: AuthService, private router: Router) {
    this.isAdmin = this.authService.isAdmin();
    this.username = this.authService.getUserName() || '';
    this.role = this.authService.getRole() || '';
  }
  toggleSidebar() { this.sidebarCollapsed = !this.sidebarCollapsed; }
  logout() { this.authService.logout(); }
}