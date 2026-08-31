/**
 * Realm-Rollen aus Keycloak. Sie stehen im Access-Token unter realm_access.roles,
 * gross geschrieben und ohne Präfix.
 */
export class AppRoles {
  static Admin = 'ADMIN';
  static Employer = 'EMPLOYER';
  static JobSeeker = 'JOB_SEEKER';
}
