import { HttpClient, HttpHeaders } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserCurrent, UserRegister } from '../interfaces/user.interface';
import { AuthStatus } from '../interfaces/auth-status.enum';
import { LoginResponse } from '../interfaces/login-response.interface';
import { CheckTokenResponse } from '../interfaces/check-token-response.interface';
import { RegisterResponse } from '../interfaces/register-response.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  
  private readonly baseUrl: string = environment.baseUrl;
  
  // private _currentUser = signal<UserCurrent | null>(null);
  private _authStatus = signal<AuthStatus>(AuthStatus.checking);

  // public currentUser = computed(() => {
  //   const user = this._currentUser();
  //   const fullname = `${user?.name} ${user?.lastName}`;
  //   console.log(fullname);
  //   return fullname;
  // });
  public authStatus = computed(() => this._authStatus());
  public currentUser?: UserCurrent; 

  constructor(
    private http: HttpClient
  ) {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(token: string): boolean {
    this._authStatus.set(AuthStatus.authenticated);
    localStorage.setItem('token', token);
    return true;
  }

  // Inicio de sesión
  login(email: string, password: string): Observable<boolean> {
    const url = `${this.baseUrl}/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>(url, body).pipe(
      map(({ token }) => this.setAuthentication(token)),
      catchError((err) => {
        let errorMessage = err.error.message;
        if (err.status === 0) {
          errorMessage = 'No se pudo establecer conexión con el servidor. Por favor, revise su conexión a internet e inténtelo de nuevo.';
        } else if (err.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
        } else if (errorMessage.includes('email')) {
          errorMessage = 'El email no está registrado. Por favor, regístrese.';
        } else if (errorMessage.includes('password')) {
          errorMessage = 'Contraseña incorrecta. Por favor, inténtelo de nuevo.';
        } else {
          errorMessage = 'Ocurrió un error. Por favor, inténtelo de nuevo.';
        }
        return throwError(() => errorMessage);
      })
    );
  }
  
  // Registra un nuevo usuario
  register(user: UserRegister): Observable<RegisterResponse> {
    const url = `${this.baseUrl}/auth/register`;

    return this.http.post<RegisterResponse>(url, user)
    .pipe(
      catchError((err) => {
        let errorMessage = err.error.message;
        if (err.status === 0) {
          errorMessage = 'No se pudo establecer conexión con el servidor. Por favor, revise su conexión a internet e inténtelo de nuevo.';
        } else if (err.status >= 500) {
          errorMessage = 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.';
        } else if (errorMessage.includes('already exists')) {
          errorMessage = 'El email ya está registrado. Por favor, ingrese otro email.';
        } else {
          errorMessage = 'Ocurrió un error. Por favor, inténtelo de nuevo.';
        }
        return throwError(() => errorMessage);
      })
    );
  }

  // Verifica el estado de autenticación del usuario
  checkAuthStatus(): Observable<boolean> {
    const url = `${this.baseUrl}/auth/check-status`;
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    };

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<CheckTokenResponse>(url, { headers }).pipe(
      map(({ user, token }) => this.setAuthentication(token)),
      catchError(() => {
        this._authStatus.set(AuthStatus.unauthenticated);
        return of(false);
      })
    );
  }
  
  // Obtener el usuario actual
  getUser(): Observable<UserCurrent> {
    const url = `${this.baseUrl}/auth/user`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
    return this.http.get<UserCurrent>(url, { headers }).pipe(
      tap((user) => this.currentUser = user),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
  
  
  logout() {
    // localStorage.removeItem('token');
    localStorage.clear()
    // this._currentUser.set(null);
    this._authStatus.set(AuthStatus.unauthenticated);
  }
  
}
