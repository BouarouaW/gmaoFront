import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">

      <h2>Mon profil</h2>

      <!-- PROFILE FORM -->
      <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">

        <div class="form-group">
          <label>Nom</label>
          <input formControlName="nom" class="form-control">
        </div>

        <div class="form-group">
          <label>Email</label>
          <input formControlName="email" type="email" class="form-control">
        </div>

        <div class="form-group">
          <label>Téléphone</label>
          <input formControlName="telephone" class="form-control">
        </div>

        <button type="submit" [disabled]="loading" class="btn-primary">
          {{ loading ? 'Enregistrement...' : 'Mettre à jour' }}
        </button>

      </form>

      <hr>

      <h3>Changer mot de passe</h3>

      <!-- PASSWORD FORM -->
      <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">

        <div class="form-group">
          <label>Ancien mot de passe</label>
          <input formControlName="oldPassword" type="password" class="form-control">
        </div>

        <div class="form-group">
          <label>Nouveau mot de passe</label>
          <input formControlName="newPassword" type="password" class="form-control">
        </div>

        <button type="submit" [disabled]="passwordLoading" class="btn-secondary">
          {{ passwordLoading ? 'Changement...' : 'Changer mot de passe' }}
        </button>

      </form>

      <!-- MESSAGES -->
      <div *ngIf="message" class="alert success">{{ message }}</div>
      <div *ngIf="error" class="alert error">{{ error }}</div>

    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 24px;
      background: white;
      border-radius: 12px;
    }

    .form-group { margin-bottom: 20px; }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
    }

    .btn-primary {
      background: #012738;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 6px;
      width: 100%;
      cursor: pointer;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
      padding: 12px;
      border: none;
      border-radius: 6px;
      width: 100%;
      cursor: pointer;
    }

    .alert {
      padding: 12px;
      border-radius: 6px;
      margin-top: 16px;
    }

    .alert.success { background: #d4edda; color: #155724; }
    .alert.error { background: #f8d7da; color: #721c24; }

    hr { margin: 30px 0; }
  `]
})
export class ProfileComponent implements OnInit {

  profileForm: FormGroup;
  passwordForm: FormGroup;

  loading = false;
  passwordLoading = false;

  message = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {

    this.profileForm = this.fb.group({
      nom: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: ['']
    });

    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.authService.fetchCurrentUser().subscribe({
      next: (user) => {
        this.profileForm.patchValue(user);
      },
      error: () => {
        this.error = 'Impossible de charger le profil';
      }
    });
  }

  updateProfile() {
    if (this.profileForm.invalid) return;

    this.loading = true;
    this.message = '';
    this.error = '';

    this.userService.updateCurrentUser(this.profileForm.value).subscribe({
      next: () => {
        this.message = 'Profil mis à jour';
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Erreur update';
        this.loading = false;
      }
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.passwordLoading = true;

    this.userService.changePassword(
      this.passwordForm.value.oldPassword,
      this.passwordForm.value.newPassword
    ).subscribe({
      next: () => {
        this.message = 'Mot de passe changé';
        this.passwordForm.reset();
        this.passwordLoading = false;
      },
      error: () => {
        this.error = 'Erreur changement mot de passe';
        this.passwordLoading = false;
      }
    });
  }
}