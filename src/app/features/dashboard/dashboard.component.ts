import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 30px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; text-align: center;">
      <h1 style="color: #0056b3;">Système GMAO - Bontaz</h1>
      <div style="background-color: #d4edda; color: #155724; padding: 15px; border-radius: 5px; display: inline-block;">
        <strong>✅ Succès :</strong> Connexion établie avec le backend.
      </div>
      <p style="margin-top: 20px;">Bienvenue sur votre espace de travail, admin.</p>
    </div>
  `
  // Supprime la ligne styleUrl qui commence par ./dashboard.component.css
})
export class DashboardComponent {}