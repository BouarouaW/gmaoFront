// src/app/features/admin/user-form/user-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './user-form.component.html',
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: number | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nom: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telephone: [''],
      role: ['USER', Validators.required],
      password: ['', [Validators.minLength(6)]] // facultatif en édition
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    if (this.userId) {
      this.isEditMode = true;
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userService.getUserById(this.userId).subscribe(user => {
        this.userForm.patchValue(user);
      });
    } else {
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  getPasswordStrength(): string {
    const pwd = this.userForm.get('password')?.value || '';
    if (pwd.length < 6) return 'weak';
    if (/[a-z]/.test(pwd) && /[0-9]/.test(pwd) && pwd.length >= 8) return 'strong';
    return 'medium';
  }
  getPasswordStrengthLabel(): string {
    const s = this.getPasswordStrength();
    if (s === 'weak') return 'Faible';
    if (s === 'medium') return 'Moyen';
    return 'Fort';
  }

 onSubmit(): void {
  if (this.userForm.invalid) return;
  this.loading = true;
  const data = this.userForm.value;
  console.log('📤 Données envoyées:', data); // ← AJOUTE CETTE LIGNE
  
  if (this.isEditMode && this.userId) {
    this.userService.updateUser(this.userId, data).subscribe({
      next: () => this.router.navigate(['/admin/users']),
      error: (err) => {
        console.error('❌ Erreur:', err);
        this.loading = false;
      }
    });
  } else {
    this.userService.createUser(data).subscribe({
      next: () => this.router.navigate(['/admin/users']),
      error: (err) => {
        console.error('❌ Erreur création:', err);
        console.error('📝 Réponse erreur:', err.error);
        this.loading = false;
      }
    });
  }
}
}