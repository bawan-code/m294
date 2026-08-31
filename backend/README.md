Hello my friend

Project-Documentation in: backend\Projektarbeit_m295_Mahmud_Bawan.docx

KeyCloack test Users:

Admin:
- email: admin@admin.com
- pwd: admin123

Employer:
- email: employer@employer.com
- pwd: employer123

Job-Seeker:
- email: seeker@seeker.com
- pwd: seeker123

---

## Anpassungen für das Frontend (Modul 294)

### Angemeldeter Benutzer

`GET /api/users/me` gibt den lokalen Benutzer zum angemeldeten Keycloak-Konto zurück.
Das Frontend braucht diesen Endpoint, um nach dem Login seine numerische `userId` zu
erfahren — im Token steht nur die Keycloak-UUID. Aufgelöst wird das über
`security/CurrentUserService`.

### Identität kommt aus dem Token

Die Create-Endpoints nehmen den handelnden Benutzer nicht mehr aus dem Request-Body:

| Endpoint | vorher | jetzt |
| --- | --- | --- |
| `POST /api/job-postings` | `employerId` im Body | aus dem Token |
| `POST /api/job-applications` | `jobSeekerId` im Body | aus dem Token |
| `POST /api/saved-jobs` | `userId` im Body | aus dem Token |

`POST /api/job-postings` akzeptiert neu auch die Rolle ADMIN (vorher liess `SecurityConfig`
ADMIN durch, der Service wies ihn danach still mit 404 ab).

### CSRF

CSRF ist aktiv (`CookieCsrfTokenRepository.withHttpOnlyFalse()`). Der erste GET setzt ein
`XSRF-TOKEN`-Cookie, das bei schreibenden Requests als `X-XSRF-TOKEN`-Header
zurückgeschickt werden muss. `POST /api/auth/register` und `POST /api/auth/login` sind
ausgenommen, damit Testbenutzer weiterhin direkt über die Swagger UI angelegt werden können.

### Keycloak: Client für das Frontend

Zusätzlich zu `job-marketplace-api` und `job-marketplace-admin` (beide bleiben confidential)
wird ein public Client für die Angular-Anwendung benötigt:

```
clientId:                  job-marketplace-frontend
Client authentication:     off  (public)
Standard flow:             on
Direct access grants:      off
Valid redirect URIs:       http://localhost:4200/*
Valid post logout URIs:    http://localhost:4200
Web origins:               http://localhost:4200
PKCE:                      S256
Full scope allowed:        on   (sonst fehlen die Realm-Rollen im Token)
```

Nach dem Anlegen den Realm neu exportieren (Realm settings → Action → Partial export,
mit Clients) und `realm-export.json` überschreiben.

## Build und Tests

```
./mvnw test
```

Zwei Hinweise dazu:

- `StellenAnzeigeApplicationTests` ist ein `@SpringBootTest` und startet den kompletten
  Kontext — dafür müssen PostgreSQL **und** Keycloak laufen. Ohne diese schlägt der Test
  fehl; die übrigen Testklassen laufen unabhängig davon.
- Der `maven-compiler-plugin`-Block in der `pom.xml` mit `annotationProcessorPaths` ist
  notwendig: Seit JDK 23 führt javac Annotation-Processors nicht mehr automatisch aus, wenn
  sie nur auf dem Klassenpfad liegen. Ohne den Eintrag generiert Lombok keine Getter und
  der Maven-Build schlägt fehl. IntelliJ ist davon nicht betroffen, weil es mit einem
  eigenen Lombok-Plugin kompiliert.
