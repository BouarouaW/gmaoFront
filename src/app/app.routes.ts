import { Routes } from '@angular/router';
import { authGuard, AdminGuard } from './core/guards/auth.guard';
import { LayoutComponent } from './features/layout/layout.component';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'profile', redirectTo: 'dashboard' },
      {
        path: 'admin',
        canActivate: [AdminGuard],
        children: [
          { path: 'users', loadComponent: () => import('./features/admin/user-list/user-list.component').then(m => m.UserListComponent) },
          { path: 'users/new', loadComponent: () => import('./features/admin/user-form/user-form.component').then(m => m.UserFormComponent) },
          { path: 'users/edit/:id', loadComponent: () => import('./features/admin/user-form/user-form.component').then(m => m.UserFormComponent) }
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];