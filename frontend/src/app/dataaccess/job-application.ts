import { Status } from './status';

export class JobApplication {
  public applicationId!: number;
  public status: Status = 'PENDING';
  public appliedAt = '';

  public jobId!: number;
  public jobTitle = '';

  public jobSeekerId!: number;
  public jobSeekerName = '';
  public jobSeekerEmail = '';

  public employerId!: number;
  public employerName = '';
}
