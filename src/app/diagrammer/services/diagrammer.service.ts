import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, Subject, tap, throwError } from 'rxjs';
import { Diagram } from 'src/app/shared/interfaces/diagram.interface';
import { environment } from 'src/environments/environment';
import { Link } from '../interfaces/link.interface';

@Injectable({
  providedIn: 'root',
})
export class DiagrammerService {
  private readonly baseUrl: string = environment.baseUrl;
  private currentDiagram?: Diagram;
  private link = new Subject<Link>();

  getCurrentDiagram(): Diagram | undefined {
    return this.currentDiagram;
  }

  setCurrentDiagram(diagram: Diagram): void {
    this.currentDiagram = diagram;
  }

  getLink(): Observable<Link> {
    return this.link.asObservable();
  }

  setLink(link: Link): void {
    this.link.next(link);
  }

  constructor(private http: HttpClient) {}

  generateTokenShare(id: number): Observable<Link> {
    const url = `${this.baseUrl}/diagram/share-token/${id}`;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<Link>(url, { headers }).pipe(
      // tap((resp) => console.log(resp)),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }
}
