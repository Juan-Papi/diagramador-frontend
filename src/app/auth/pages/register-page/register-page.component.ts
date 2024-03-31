import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ValidatorsService } from '../../../shared/services/validators.service';
import { AlertsService } from 'src/app/shared/services/alerts.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validator';
import { UserRegister } from '../../interfaces/user.interface';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css'],
})
export class RegisterPageComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private validatorsService: ValidatorsService,
    private alertService: AlertsService,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required]],
        lastname: ['', [Validators.required]],
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
        repeatPassword: ['', [Validators.required]],
      },
      {
        validators: [
          CustomValidators.mustBeEqual(
            'password',
            'repeatPassword'
          ),
        ],
      }
    );
  }
  
  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.registerForm, field);
  }
  
  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.registerForm, field);
  }
  
  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    
    const formData = this.registerForm.value;
    const user: UserRegister = {
      name: formData.name,
      lastName: formData.lastname,
      email: formData.email,
      password: formData.password,
    }
    
    this.authService.register(user)
      .subscribe({
        next: (response) => {
          this.alertService.success('Usuario registrado con éxito');
          console.log(response);
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 3000);
        },
        error: (errorMessage) => {
          this.alertService.error(errorMessage);
          console.error('Error en el registro:', errorMessage);
        },
      });
  }
  
  
  
}
