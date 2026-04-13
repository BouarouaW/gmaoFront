import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { AuthService, LoginResponse } from '../../../core/services/auth.service';   // ← chemin corrigé
import { HttpErrorResponse } from '@angular/common/http';  // pour typer l'erreur

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response: LoginResponse) => {          // ← typé correctement
        this.loading = false;
        console.log('Login OK', response);
        this.router.navigate(['/dashboard']);
      },
      error: (err: HttpErrorResponse) => {          // ← typé correctement
        this.loading = false;
        this.errorMessage = err.error?.message || 'Erreur de connexion';
      }
    });
  }
}