import { Component, computed, effect, inject } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces/auth-status.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  
  public finishedAuthCheck = computed<boolean>(() => {
    if (this.authService.authStatus() === AuthStatus.checking) {
      return false;
    }
    return true;
  });
  
  public authStatusChangedEffect = effect(() => {
    // console.log('authStatusChangedEffect: ', this.authService.authStatus());
    
    // const url = localStorage.getItem('url');
    
    switch(this.authService.authStatus()) {
      case AuthStatus.checking: 
        return;
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/home');
        break;
      case AuthStatus.unauthenticated:
        this.router.navigateByUrl('/inicio');
        break;
    }
    
  });
  
}
