import { Component, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from "../../../shared/components/button/button";
import { CustomInput } from "../../../shared/components/custom-input/custom-input";
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Button, CustomInput],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router);
  authService = inject(AuthService);

  loginForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onLoginClick() {
    console.log('Login button clicked');
    const loginUser = this.loginForm.get('email')?.value as string;
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
