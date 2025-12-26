import { Component, inject, ChangeDetectionStrategy, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../core/services/auth-service';
import { Button } from '../../shared/components/button/button';
import { ConfirmationModal } from '../../shared/components/confirmation-modal/confirmation-modal';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    Button,
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  currentUser = this.authService.currentUser;

  ngOnInit() {
    // Load current user from localStorage if not already loaded
    if (!this.currentUser()) {
      const user = this.authService.getCurrentUser();
      if (!user) {
        // If still no user, redirect to login
        this.router.navigate(['/login']);
      }
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  logout(): void {
    const dialogRef = this.dialog.open(ConfirmationModal, {
      width: '400px',
      data: {
        title: 'Logout',
        message: 'Are you sure you want to logout?',
        confirmText: 'Logout',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.authService.logout();
        this.router.navigate(['/login']);
      }
    });
  }

  getRoleDisplay(): string {
    const role = this.currentUser()?.role;
    return role === 'ADMIN' ? 'Administrator' : 'Clinician';
  }

  getRoleIcon(): string {
    const role = this.currentUser()?.role;
    return role === 'ADMIN' ? 'admin_panel_settings' : 'person';
  }
}
