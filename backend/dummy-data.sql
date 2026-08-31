-- Testdaten für die Job-Marketplace-Datenbank.
--
-- Aufruf:
--   psql -U postgres -h localhost -d JobMarketplace -f backend/dummy-data.sql
--
-- Das Skript legt KEINE Benutzer an. Benutzer müssen über POST /api/auth/register
-- entstehen, weil sie eine gültige keycloak_id brauchen — ohne die findet
-- GET /api/users/me den Datensatz nicht.
--
-- Alle Einfügungen sind über NOT EXISTS abgesichert und können gefahrlos
-- mehrfach ausgeführt werden.

BEGIN;

-- ---------------------------------------------------------------------------
-- Stelleninserate, zugeordnet an den ersten Benutzer mit der Rolle EMPLOYER
-- ---------------------------------------------------------------------------

INSERT INTO job_postings (title, description, location, salary_range, created_at, updated_at, employer_id)
SELECT v.title, v.description, v.location, v.salary_range,
       now() - (v.age || ' days')::interval,
       now() - (v.age || ' days')::interval,
       (SELECT user_id FROM users WHERE role = 'EMPLOYER' ORDER BY user_id LIMIT 1)
FROM (VALUES
  ('Senior Java Entwickler',
   'Wir suchen eine erfahrene Entwicklerin oder einen erfahrenen Entwickler für unsere Spring-Boot-Backends. Sie arbeiten in einem Team von acht Personen an einer Plattform mit mehreren tausend täglichen Nutzern. Erfahrung mit Spring Boot, JPA und PostgreSQL setzen wir voraus.',
   'Zürich', '95000 - 115000 CHF', 3),

  ('Frontend Entwicklerin Angular',
   'Für den Ausbau unserer Weboberflächen suchen wir Verstärkung im Frontend. Sie entwickeln mit Angular und TypeScript, arbeiten eng mit unserem UX-Team zusammen und bringen eigene Ideen in die Gestaltung ein.',
   'Bern', '85000 - 100000 CHF', 5),

  ('DevOps Engineer',
   'Sie betreuen unsere CI/CD-Pipelines und die Container-Infrastruktur. Kubernetes, Docker und GitLab CI gehören zu Ihrem Alltag. Wir bieten viel Gestaltungsfreiheit und ein Team, das Automatisierung ernst nimmt.',
   'Basel', '100000 - 120000 CHF', 8),

  ('Systemadministrator',
   'Betreuung unserer internen Server- und Netzwerkinfrastruktur. Sie sind erste Anlaufstelle bei Störungen, planen Wartungsfenster und dokumentieren Änderungen sauber nach.',
   'Luzern', '75000 - 90000 CHF', 12),

  ('Data Analyst',
   'Sie werten unsere Nutzungsdaten aus und bereiten sie für Fachabteilungen auf. SQL beherrschen Sie sicher, Erfahrung mit Python und Visualisierungswerkzeugen ist von Vorteil.',
   'Zürich', '88000 - 105000 CHF', 15),

  ('Mobile Entwickler iOS',
   'Für unsere Kundenapp suchen wir Verstärkung in der iOS-Entwicklung. Swift und SwiftUI sind Ihnen vertraut, App-Store-Releases haben Sie schon begleitet.',
   'Lausanne', '90000 - 110000 CHF', 18),

  ('IT-Supporter First Level',
   'Sie nehmen Störungsmeldungen entgegen, lösen was sich lösen lässt und leiten den Rest gezielt weiter. Freundlichkeit und Geduld sind uns wichtiger als eine perfekte Ausbildung.',
   'St. Gallen', '65000 - 78000 CHF', 22),

  ('Cloud Architect',
   'Sie entwerfen die Zielarchitektur unserer Cloud-Migration und begleiten die Umsetzung. Fundierte Erfahrung mit AWS oder Azure sowie mit Infrastructure as Code bringen Sie mit.',
   'Zug', '120000 - 145000 CHF', 27)
) AS v(title, description, location, salary_range, age)
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'EMPLOYER')
  AND NOT EXISTS (SELECT 1 FROM job_postings jp WHERE jp.title = v.title);

-- ---------------------------------------------------------------------------
-- Bewerbungen des ersten JOB_SEEKER, alle drei Status vertreten
-- ---------------------------------------------------------------------------

INSERT INTO applications (status, applied_at, job_id, job_seeker_id)
SELECT v.status,
       now() - (v.age || ' days')::interval,
       (SELECT job_id FROM job_postings WHERE title = v.title),
       (SELECT user_id FROM users WHERE role = 'JOB_SEEKER' ORDER BY user_id LIMIT 1)
FROM (VALUES
  ('Senior Java Entwickler',       'PENDING',  2),
  ('Frontend Entwicklerin Angular','ACCEPTED', 4),
  ('DevOps Engineer',              'REJECTED', 7),
  ('Data Analyst',                 'PENDING',  9)
) AS v(title, status, age)
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'JOB_SEEKER')
  AND EXISTS (SELECT 1 FROM job_postings WHERE title = v.title)
  AND NOT EXISTS (
    SELECT 1 FROM applications a
    WHERE a.job_id = (SELECT job_id FROM job_postings WHERE title = v.title)
      AND a.job_seeker_id = (SELECT user_id FROM users WHERE role = 'JOB_SEEKER' ORDER BY user_id LIMIT 1)
  );

-- ---------------------------------------------------------------------------
-- Merkliste des ersten JOB_SEEKER
-- ---------------------------------------------------------------------------

INSERT INTO saved_jobs (saved_at, job_id, user_id)
SELECT now() - (v.age || ' days')::interval,
       (SELECT job_id FROM job_postings WHERE title = v.title),
       (SELECT user_id FROM users WHERE role = 'JOB_SEEKER' ORDER BY user_id LIMIT 1)
FROM (VALUES
  ('Mobile Entwickler iOS',   1),
  ('Cloud Architect',         3),
  ('IT-Supporter First Level',6)
) AS v(title, age)
WHERE EXISTS (SELECT 1 FROM users WHERE role = 'JOB_SEEKER')
  AND EXISTS (SELECT 1 FROM job_postings WHERE title = v.title)
  AND NOT EXISTS (
    SELECT 1 FROM saved_jobs s
    WHERE s.job_id = (SELECT job_id FROM job_postings WHERE title = v.title)
      AND s.user_id = (SELECT user_id FROM users WHERE role = 'JOB_SEEKER' ORDER BY user_id LIMIT 1)
  );

COMMIT;
