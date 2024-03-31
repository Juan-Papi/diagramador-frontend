import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  private alertSubject = new Subject<any>();

  getAlerts() {
    return this.alertSubject.asObservable();
  }

  success(message: string) {
    this.alertSubject.next({ type: 'success', message });
  }

  error(message: string) {
    this.alertSubject.next({ type: 'error', message });
  }

  clear() {
    this.alertSubject.next('');
  }
  
}
