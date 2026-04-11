import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard">
      <nav class="sidebar">
        <div class="logo">🏭 GMAO Bontaz</div>
        <ul>
          <li routerLink="/dashboard">📊 Tableau de bord</li>
          <li *ngIf="isAdmin" routerLink="/admin/users">👥 Utilisateurs</li>
          <li>🔧 Interventions</li>
          <li>⚙️ Équipements</li>
        </ul>
        <button class="logout" (click)="logout()">🚪 Déconnexion</button>
      </nav>
      <div class="content">
        <h1>Bienvenue {{ username }} !</h1>
        <p>Rôle : {{ role }}</p>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      display: flex;
      height: 100vh;
    }
    .sidebar {
      width: 250px;
      background: linear-gradient(180deg, #012738, #01161a);
      color: white;
      padding: 20px;
      display: flex;
      flex-direction: column;
    }
    .logo {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .sidebar ul {
      list-style: none;
      padding: 0;
      flex: 1;
    }
    .sidebar li {
      padding: 12px;
      margin: 8px 0;
      border-radius: 8px;
      cursor: pointer;
    }
    .sidebar li:hover {
      background: rgba(255,255,255,0.1);
    }
    .logout {
      background: #dc3545;
      border: none;
      padding: 10px;
      border-radius: 8px;
      color: white;
      cursor: pointer;
    }
    .content {
      flex: 1;
      padding: 24px;
    }
  `]
})
export class DashboardComponent {
  isAdmin = false;
  username = '';
  role = '';

  constructor(private authService: AuthService, private router: Router) {
    const user = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.username = user?.username || '';
    this.role = user?.role || '';
  }

  logout(): void {
    this.authService.logout();
  }
}