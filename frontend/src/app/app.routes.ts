import { Routes } from '@angular/router';
import { AppRoles } from '../app.roles';
import { appCanActivate } from './guard/app.auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { JobListComponent } from './pages/job-list/job-list.component';
import { MyApplicationsComponent } from './pages/my-applications/my-applications.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { SavedJobsComponent } from './pages/saved-jobs/saved-jobs.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Öffentlich lesbar, das Backend gibt GET /api/job-postings ohne Token frei.
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent, pathMatch: 'full' },

  // Benutzerbezogen: nur JOB_SEEKER. Ein ADMIN hat keine lokale userId,
  // die Seiten blieben für ihn leer.
  {
    path: 'my-applications', component: MyApplicationsComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.JobSeeker] }
  },
  {
    path: 'saved-jobs', component: SavedJobsComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.JobSeeker] }
  },

  { path: 'noaccess', component: NoAccessComponent },
];
