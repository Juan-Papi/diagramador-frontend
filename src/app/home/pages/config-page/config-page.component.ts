import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserCurrent } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ValidatorsService } from 'src/app/shared/services/validators.service';
import { HomeService } from '../../services/home.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.component.html',
  styleUrls: ['./config-page.component.css'],
})
export class ConfigPageComponent implements OnInit {
  // @ViewChild('fileName') fileName!: ElementRef;
  imagePreview!: string;
  photo?: File;
  loading!: boolean;
  
  configForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private homeService: HomeService,
    private fb: FormBuilder,
    private validatorsService: ValidatorsService
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.imagePreview = this.user?.profile.photo || './assets/images/user.png';
    const gender = this.user?.profile.gender;
    
    this.configForm = this.fb.group({
      file: [null, [Validators.required]],
      gender: [gender],
    });
  }

  get user(): UserCurrent | undefined {
    return this.authService.currentUser;
  }

  onFileChange(event: any): void {
    const file: File = event.target.files[0];
    
    if (file) {
      this.photo = file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
    }
  }

  onSubmit(): void {
    if (this.configForm.invalid) {
      this.configForm.markAllAsTouched();
      return;
    }
    
    const id = this.user?.profile.id;
    const {gender} = this.configForm.value;
    if (!id && !this.photo) return;
    
    this.loading = true; // Habilitar estado de carga
    
    this.homeService.uploadProfile(id!, this.photo!, gender).subscribe({
      next: (resp) => {
        
        Swal.fire({
          title: '¡Actualizado!',
          text: 'Perfil actualizado correctamente.',
          icon: 'success',
          timer: 1500,
        });
        
        this.loading = false; 
        this.authService.getUser().subscribe({
          next: (user) => {
            this.imagePreview = user.profile.photo;
          }
        });
      },
      error: (err) => {
        // console.log(err);
        Swal.fire({
          title: '¡Error!',
          text: 'Error al actualizar el perfil.',
          icon: 'error',
          timer: 1500,
        });
        this.loading = false;
      }
    });

  }

  isValidField(field: string): boolean | null {
    return this.validatorsService.isValidField(this.configForm, field);
  }

  getMessageError(field: string): string | null {
    return this.validatorsService.getErrorMessage(this.configForm, field);
  }
}
