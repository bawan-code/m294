# Job Marketplace — Frontend

Angular-Frontend zur Job-Marketplace-API aus Modul 295. Projektarbeit Modul 294.

## Voraussetzungen

| Dienst | Port | Hinweis |
| --- | --- | --- |
| Frontend | 4200 | dieses Projekt |
| Backend | 9090 | `backend/`, mit `./mvnw spring-boot:run` starten |
| Keycloak | 8080 | Realm `job-marketplace` aus `backend/realm-export.json` |
| PostgreSQL | 5432 | Datenbank `JobMarketplace` |

Node 24 wird vorausgesetzt.

In Keycloak muss der public Client `job-marketplace-frontend` existieren (Redirect-URI
`http://localhost:4200/*`). Die Details stehen in `backend/README.md`.

Bei abweichenden Ports müssen sowohl `SecurityConfig` im Backend als auch die
Client-Einstellungen in Keycloak angepasst werden.

## Befehle

```bash
npm install
```

```bash
npm start
```

```bash
npm test
```

```bash
npm run lint
```

Testdaten für die Datenbank liegen in `backend/dummy-data.sql`.

## Testbenutzer

Die Zugangsdaten stehen in `backend/README.md`. Administratoren existieren nur in Keycloak
und haben bewusst keinen Datensatz in der Datenbank — für sie liefert `/api/users/me` ein 404,
und benutzerbezogene Seiten stehen ihnen nicht offen.

## Routen und Rollen

| Pfad | Komponente | Rollen |
| --- | --- | --- |
| `/`, `/dashboard` | Dashboard | alle, Kacheln rollenabhängig |
| `/jobs` | Stellenliste | öffentlich |
| `/jobs/:id` | Stellendetail | öffentlich, Aktionen rollenabhängig |
| `/register` | Registrierung | öffentlich |
| `/my-job-postings` | Meine Inserate | EMPLOYER |
| `/job-posting`, `/job-posting/:id` | Inserat erfassen/bearbeiten | EMPLOYER |
| `/job-postings/:id/applications` | Bewerbungen auf ein Inserat | EMPLOYER |
| `/my-applications` | Meine Bewerbungen | JOB_SEEKER |
| `/saved-jobs` | Gemerkte Jobs | JOB_SEEKER |
| `/profile` | Mein Profil | EMPLOYER, JOB_SEEKER |
| `/users` | Benutzerverwaltung | ADMIN |
| `/all-applications` | Alle Bewerbungen | ADMIN |
| `/noaccess` | Kein Zugriff | alle |

Der Schutz ist zweistufig: `appCanActivate` an der Route mit `data: { roles: [...] }`,
und `*appIsInRole` für einzelne Teile einer Seite.

**Rollenabhängige Seitenteile** zeigt am deutlichsten `/jobs/:id`: dieselbe öffentliche Route
blendet für JOB_SEEKER „Jetzt bewerben" und „Job merken" ein, für EMPLOYER „Bearbeiten",
„Bewerbungen ansehen" und „Löschen", und für anonyme Besucher keine Aktion.

## Projektstruktur

```
src/app/
  components/     Header, Login, Confirm-Dialog, Status-Badge, Base
  pages/          über das Routing angesteuerte Seiten
  dataaccess/     Modellklassen zu den Backend-DTOs
  service/        ein Service pro Ressource
  guard/          Route-Guard mit Rollenprüfung
  dir/            Struktur-Direktiven für rollenabhängige Sichtbarkeit
  interceptor/    XSRF-Interceptor
```

## Services

| Service | Endpoints | Methoden |
| --- | --- | --- |
| `JobPostingService` | `/api/job-postings` | **voller CRUD**: getList, getOne, save, update, delete, getListByUser |
| `JobApplicationService` | `/api/job-applications` | getList, getOne, save, updateStatus, delete, getListByUser, getListByJob |
| `SavedJobService` | `/api/saved-jobs` | getList, getOne, save, delete, getListByUser |
| `UserService` | `/api/users` | getList, getOne, getMe, update, delete |
| `RegistrationService` | `/api/auth/register` | register — kein CRUD, deshalb kein `save()` |

Dazu `CurrentUserService`: Er lädt über `GET /api/users/me` die lokale `userId`, die alle
benutzerbezogenen Endpoints benötigen — im Token steht nur die Keycloak-UUID.

## Tests

Vitest über `@angular/build:unit-test`, konfiguriert in `vitest.config.ts`.

- `service/job-posting.service.spec.ts` — alle Methoden des CRUD-Services
- `pages/job-list/job-list.component.spec.ts` — alle Methoden der Komponente
- `service/registration.service.spec.ts` — Erfolgsfall plus 409 und 400
- `components/app-header/app-header.component.spec.ts` — Smoke-Test

## Bewusste Abweichungen vom Demoprojekt

**Keine Mehrsprachigkeit.** Texte stehen als deutsche Literale in den Templates statt über
`@ngx-translate`. `BaseComponent` wurde übernommen, hält die Meldungen aber als feste Strings.

**Reaktive Validierung.** Das Demoprojekt validiert nur über Template-Attribute
(`required`, `maxlength`). Hier kommen `Validators` und `mat-error` dazu, damit
Validierungsfehler sichtbar werden. Die FormGroup wird deshalb einmalig deklariert und beim
Laden per `patchValue` befüllt — ein `formBuilder.group(obj)` würde die Validatoren verlieren.

**Rollen aus dem Realm-Claim.** `AppAuthService.getRoles()` liest `realm_access.roles`, nicht
`resource_access.<client>.roles` wie das Demoprojekt. Dieses Backend vergibt Realm-Rollen.
Die Rollen laufen über ein `BehaviorSubject`, damit Guard und Direktiven sie auch dann
erhalten, wenn das Token erst nach ihrer Initialisierung eintrifft.

**Löschen prüft auch 204.** Das Backend antwortet auf DELETE mit `204 No Content`, das
Demoprojekt prüft nur auf `200`. Ohne die Ergänzung meldet jedes erfolgreiche Löschen einen
Fehler.

**ESLint als Flat Config.** Gleicher Regelsatz wie das Demoprojekt, aber in
`eslint.config.js` — ESLint 9 lädt das eslintrc-Format nicht mehr ohne Zusatzschalter.
