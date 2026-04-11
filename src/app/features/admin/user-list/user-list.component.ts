// src/app/features/admin/user-list/user-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-list.component.html', // utilise le HTML que tu as
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  roleFilter = '';
  statusFilter = '';
  currentPage = 1;
  pageSize = 10;
  showDeleteModal = false;
  userIdToDelete: number | null = null;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    if (this.authService.isAdmin()) this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => { this.users = data; this.filterUsers(); },
      error: (err) => console.error(err)
    });
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchSearch = !this.searchTerm ||
        user.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchRole = !this.roleFilter || user.role === this.roleFilter;
      const matchStatus = !this.statusFilter || String(user.actif) === this.statusFilter;
      return matchSearch && matchRole && matchStatus;
    });
    this.currentPage = 1;
  }

  get activeCount(): number { return this.filteredUsers.filter(u => u.actif).length; }
  get inactiveCount(): number { return this.filteredUsers.filter(u => !u.actif).length; }
  get totalPages(): number { return Math.ceil(this.filteredUsers.length / this.pageSize); }
  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  previousPage() { if (this.currentPage > 1) this.currentPage--; }
  nextPage() { if (this.currentPage < this.totalPages) this.currentPage++; }

  getRoleLabel(role: string): string {
    if (role === 'ADMIN') return 'Administrateur';
    if (role === 'TECHNICIEN') return 'Technicien';
    return 'Utilisateur';
  }

  editUser(id: number) { /* navigation faite via routerLink */ }
  desactiver(id: number) { this.userService.desactiverUser(id).subscribe(() => this.loadUsers()); }
  activer(id: number) { this.userService.activerUser(id).subscribe(() => this.loadUsers()); }

  deleteUser(id: number) {
    this.userIdToDelete = id;
    this.showDeleteModal = true;
  }
  confirmDelete() {
    if (this.userIdToDelete) this.userService.deleteUser(this.userIdToDelete).subscribe(() => this.loadUsers());
    this.closeModal();
  }
  closeModal() { this.showDeleteModal = false; this.userIdToDelete = null; }
}