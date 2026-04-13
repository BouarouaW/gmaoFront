import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  isAdmin = false;
  username = '';
  roleLabel = '';

  constructor(private authService: AuthService) {
    this.isAdmin = this.authService.isAdmin();
    this.username = this.authService.getUserName() || 'Utilisateur';
    const role = this.authService.getRole();
    const roles: Record<string, string> = {
      ADMIN: 'Administrateur',
      TECHNICIEN: 'Technicien',
      USER: 'Utilisateur'
    };
    this.roleLabel = roles[role || ''] || role || 'Utilisateur';
  }

  logout() {
    this.authService.logout();
  }
}