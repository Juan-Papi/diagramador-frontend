import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DiagramsResponse } from '../interfaces/diagrams-response.interface';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private readonly baseUrl: string = environment.baseUrl;
  private projects?: DiagramsResponse[];
  
  private projectsSubject = new Subject<DiagramsResponse[]>();
  projects$ = this.projectsSubject.asObservable();
  
  get proyectsList(): DiagramsResponse[] {
    return this.projects || [];
  }

  setProyects(projects: DiagramsResponse[]) {
    this.projects = projects;
    this.projectsSubject.next(projects);
  }

  constructor(private http: HttpClient) {}

  // Obtener los proyectos del usuario actual
  getProyects(): Observable<DiagramsResponse[]> {
    const url = `${this.baseUrl}/diagram`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<DiagramsResponse[]>(url, { headers }).pipe(
      tap((diagrams) => (this.projects = diagrams)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  // Obtener los proyectos con paginación
  // getAllProjectsPagination(
  //   page: number,
  //   limit: number,
  //   date?: string,
  //   search?: string
  // ): Observable<DiagramsResponse[]> {
  //   let params = new HttpParams()
  //     .set('offset', (page + 1).toString())
  //     .set('limit', limit.toString());

  //   const url = `${this.baseUrl}/drawing`;
  //   const token = localStorage.getItem('token');
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  //   if (date) {
  //     params = params.set('date', date);
  //   }

  //   if (search) {
  //     params = params.set('search', search);
  //   }

  //   return this.http.get<DiagramsResponse[]>(url, { headers, params }).pipe(
  //     tap((diagrams) => (this.projects = diagrams)),
  //     catchError((err) => {
  //       return throwError(() => err);
  //     })
  //   );
  // }
  
  
  // Filtrar proyectos por fecha y nombre
  // filterProjects(date?: string, search?: string): Observable<any> {
  //   const url = `${this.baseUrl}/diagram`;
  //   const token = localStorage.getItem('token');
  //   let headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  //   headers = new HttpHeaders().set('Content-Type', 'application/json');
    
  //   let body: any = {};

  //   if (date) {
  //     body['date'] = date;
  //   }

  //   if (search) {
  //     body['search'] = search;
  //   }

  //   return this.http.get(url, { headers, observe: body }).pipe(
  //     // tap((diagrams) => (this.projects = diagrams)),
  //     tap((resp) => console.log(resp)),
  //     catchError((err) => {
  //       return throwError(() => err);
  //     })
  //   );
  // }
  
  // Actualizar un proyecto
  updateDiagram(id: number, name: string, description: string): Observable<boolean> {
    const url = `${this.baseUrl}/diagram/update/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { name, description };
    
    return this.http.patch<boolean>(url, body, { headers }).pipe(
      catchError((err) => {
        if (err.status === 200) {
          return of(true);
        }
        return of(false);
      })
    );
  }

  // Eliminar un proyecto
  deleteProyect(id: number): Observable<boolean> {
    const url = `${this.baseUrl}/diagram/delete/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.delete<boolean>(url, { headers }).pipe(
      // tap((res) => console.log(res)),
      catchError((err) => {
        if (err.status === 200) {
          return of(true);
        }
        // return throwError(() => err);
        return of(false);
      })
    );
  }
}
