import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgIf, MatIconModule],
  templateUrl: './dashboard.component.html',   // ← template externe
  styleUrls: ['./dashboard.component.css']    // ← styles externes
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
    const roles: Record<string, string> = {
      ADMIN: 'Administrateur',
      TECHNICIEN: 'Technicien',
      USER: 'Utilisateur'
    };
    this.roleLabel = roles[this.role] || this.role;
  }
}