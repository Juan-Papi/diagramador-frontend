import { Component, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnDestroy {

  private subscription: Subscription;
  message!: string;
  success!: boolean;
  show!: boolean;

  constructor(private alertService: AlertsService) {
    this.subscription = this.alertService.getAlerts().subscribe(alert => {
      if (alert) {
        this.message = alert.message;
        this.success = alert.type === 'success';
        this.show = true;

        setTimeout(() => {
          this.show = false;
        }, 4000); // Ocultar la alerta después de 4 segundos
      } else {
        this.show = false;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  
}
