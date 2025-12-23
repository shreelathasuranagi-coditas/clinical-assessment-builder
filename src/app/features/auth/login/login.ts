import { Component, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router);
  authService = inject(AuthService)

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onLoginClick() {
    const loginUser = this.loginForm.get('username')?.value as string;
    const loginPass = this.loginForm.get('password')?.value as string;

    this.authService.login(loginUser, loginPass).subscribe({
      next: (user) => {
        console.log('Login successful:', user);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }
}
