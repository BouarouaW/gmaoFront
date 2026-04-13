// src/app/features/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="welcome-card">
        <h1>Bienvenue, {{ username }} !</h1>
        <p>Vous êtes connecté en tant que <strong>{{ roleLabel }}</strong></p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👤</div>
          <div class="stat-info">
            <h3>Mon profil</h3>
            <p>{{ username }}</p>
            <a routerLink="/profile">Voir mon profil →</a>
          </div>
        </div>
        
        <div class="stat-card" *ngIf="isAdmin">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Utilisateurs</h3>
            <p>Gérer les comptes</p>
            <a routerLink="/admin/users">Gérer →</a>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔧</div>
          <div class="stat-info">
            <h3>Interventions</h3>
            <p>Module à venir</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 24px; }
    .welcome-card { background: linear-gradient(135deg, #012738, #01161a); color: white; padding: 32px; border-radius: 16px; margin-bottom: 32px; }
    .welcome-card h1 { margin-bottom: 8px; font-size: 28px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
    .stat-card { background: white; border-radius: 12px; padding: 24px; display: flex; gap: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.3s; }
    .stat-card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.15); }
    .stat-icon { font-size: 48px; }
    .stat-info h3 { margin-bottom: 8px; color: #012738; }
    .stat-info p { color: #666; margin-bottom: 12px; }
    .stat-info a { color: #012738; text-decoration: none; font-weight: 500; }
    .stat-info a:hover { text-decoration: underline; }
  `]
})
export class DashboardComponent implements OnInit {
  username = '';
  role = '';
  roleLabel = '';
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.username = user.username;
      this.role = user.role;
      this.updateRoleLabel();
      this.isAdmin = this.authService.isAdmin();
    } else {
      this.authService.fetchCurrentUser().subscribe({
        next: (user) => {
          this.username = user.username;
          this.role = user.role;
          this.updateRoleLabel();
          this.isAdmin = this.authService.isAdmin();
        },
        error: () => {
          this.username = this.authService.getUserName() || 'Utilisateur';
          this.role = this.authService.getRole() || 'USER';
          this.updateRoleLabel();
          this.isAdmin = this.authService.isAdmin();
        }
      });
    }
  }

  updateRoleLabel() {
    const roles: { [key: string]: string } = {
      'ADMIN': 'Administrateur',
      'TECHNICIEN': 'Technicien',
      'USER': 'Utilisateur'
    };
    this.roleLabel = roles[this.role] || this.role;
  }
}