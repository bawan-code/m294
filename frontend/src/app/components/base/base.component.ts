import { Component } from '@angular/core';

/**
 * Sammelt die Rückmeldungstexte, die alle Listen- und Detailseiten
 * über die MatSnackBar anzeigen.
 */
@Component({
  selector: 'app-base',
  template: ''
})
export class BaseComponent {
  protected messageSaved = 'Änderungen gespeichert';
  protected messageError = 'Speichern fehlgeschlagen, Serverfehler';
  protected messageNewSaved = 'Eintrag erstellt';
  protected messageNewError = 'Eintrag konnte nicht erstellt werden, Serverfehler';
  protected messageClose = 'Schliessen';
  protected deletedMessage = 'Eintrag gelöscht';
  protected deleteErrorMessage = 'Eintrag konnte nicht gelöscht werden, Serverfehler';
  protected closeMessage = 'Schliessen';
}
