import { Component, Input } from '@angular/core';
import { Status } from '../../dataaccess/status';

/**
 * Zeigt den Status einer Bewerbung als farbiges Badge.
 * Wird von my-applications und job-posting-applications verwendet.
 */
@Component({
  selector: 'app-status-badge',
  templateUrl: './status-badge.component.html',
  styleUrls: ['./status-badge.component.scss']
})
export class StatusBadgeComponent {
  @Input() status: Status = 'PENDING';

  get label(): string {
    switch (this.status) {
      case 'ACCEPTED':
        return 'Angenommen';
      case 'REJECTED':
        return 'Abgelehnt';
      default:
        return 'Offen';
    }
  }

  get cssClass(): string {
    switch (this.status) {
      case 'ACCEPTED':
        return 'badge badge-accepted';
      case 'REJECTED':
        return 'badge badge-rejected';
      default:
        return 'badge badge-pending';
    }
  }
}
