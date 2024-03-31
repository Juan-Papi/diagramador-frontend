import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCurrent } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { CustomValidators } from 'src/app/shared/Validators/custom.validator';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css'],
})
export class ConfigPageComponent implements OnInit {
  // @ViewChild('fileName') fileName!: ElementRef;
  image: string | null = './assets/images/user.png';
  configForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService
  ) {}

  ngOnInit(): void {
    const gender = this.user?.profile.gender;
    this.configForm = this.fb.group({
      photo: [
        '',
        [
          Validators.required,
          // CustomValidators.fileExtension,
          // CustomValidators.fileSize(5242880),
        ],
      ],
      gender: [gender, []],
    });
  }

  get user(): UserCurrent | undefined {
    return this.authService.currentUser;
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.image = reader.result as string;
      };
      // this.fileName.nativeElement.textContent = file.name;
    }
  }

  onSubmit() {
    console.log(this.configForm.value);
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }

    console.log(this.configForm.value);
  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.configForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.configForm, field);
  }
}
