import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import Swal from 'sweetalert2'

import { AuthService } from '../../services/auth.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validator';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit  {

  loginForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validatorsService: ValidatorsService,
    private alertService: AlertsService,
  ) {}
  
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          CustomValidators.emailValid,
        ],
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(50),
          CustomValidators.passwordComplexity,
        ],
      ],
    });
  }
  
  
  
  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    
    const { email , password } = this.loginForm.value;
    this.authService.login(email, password)
      .subscribe({
        next: (response) => {
          this.alertService.success('Usuario autenticado con éxito');
          // console.log(response);
          const url = localStorage.getItem('url');
          setTimeout(() => {
            this.router.navigateByUrl(url || '/home');
          }, 2000);
        },
        error: (errorMessage) => {
          this.alertService.error(errorMessage);
        },
      });
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.loginForm, field);
  }
  
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.loginForm, field);
  }
  
}