import { Role } from './role';

export class User {
  public userId!: number;
  public keycloakId = '';
  public name = '';
  public email = '';
  public role: Role = 'JOB_SEEKER';
  public createdAt = '';
}
