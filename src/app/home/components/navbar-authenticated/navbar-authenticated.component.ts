import { Component, computed, OnInit } from '@angular/core';
import { UserCurrent } from 'src/app/auth/interfaces/user.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-navbar-authenticated',
  templateUrl: './navbar-authenticated.component.html',
  styleUrls: ['./navbar-authenticated.component.css']
})
export class NavbarAuthenticatedComponent implements OnInit {

  currentUser?: UserCurrent;
  
  constructor(
    private authService: AuthService,
    private homeService: HomeService,
  ) {
  }
  
  ngOnInit(): void {
    this.getCurrentUser();
    this.getAllProyects();
  }
  
  getCurrentUser(): void {
    this.authService.getUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.log({error});
      }
    });
  }
  
  getAllProyects(): void {
    this.homeService.getProyects().subscribe({
      next: (resp) => {
        // console.log('Proyectos obtenidos', resp);
      },
      error: (errorMessage) => {
        console.log({errorMessage});
      }
    });
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  
}
