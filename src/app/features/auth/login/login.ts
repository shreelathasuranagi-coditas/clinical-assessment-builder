import { Component, inject } from '@angular/core';

import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Button } from "../../../shared/components/button/button";
import { CustomInput } from "../../../shared/components/custom-input/custom-input";

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, Button, CustomInput],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  router = inject(Router);

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  onLoginClick() {
    console.log('Login attempted with', this.loginForm.value);
  }
}
