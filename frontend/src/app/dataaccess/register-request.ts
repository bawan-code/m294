import { Role } from './role';

/**
 * Spiegel von UserRegisterRequestDto im Backend.
 * ADMIN ist als Rolle nicht zulässig — Administratoren entstehen nur direkt in Keycloak.
 */
export class RegisterRequest {
  public name = '';
  public email = '';
  public password = '';
  public role: Role = 'JOB_SEEKER';
}
