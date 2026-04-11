import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  errorMessage = '';
  loading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef   // ← Injection du détecteur
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    this.errorMessage = '';
    if (this.loginForm.invalid) {
      // Gestion des erreurs de validation
      if (this.loginForm.get('email')?.invalid) {
        this.errorMessage = 'Email valide requis';
      } else if (this.loginForm.get('password')?.invalid) {
        this.errorMessage = 'Mot de passe requis (min 4 caractères)';
      }
      this.cdr.detectChanges(); // Force l'affichage immédiat
      return;
    }

    this.loading = true;
    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.message || 'Identifiants incorrects';
        console.log('Message d\'erreur:', this.errorMessage);
        this.cdr.detectChanges(); // ← FORCE LA MISE À JOUR DE LA PAGE
      }
    });
  }
}