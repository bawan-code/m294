import { Routes } from '@angular/router';
import { AppRoles } from '../app.roles';
import { appCanActivate } from './guard/app.auth.guard';
import { AllApplicationsComponent } from './pages/all-applications/all-applications.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JobDetailComponent } from './pages/job-detail/job-detail.component';
import { JobListComponent } from './pages/job-list/job-list.component';
import { JobPostingApplicationsComponent } from './pages/job-posting-applications/job-posting-applications.component';
import { JobPostingDetailComponent } from './pages/job-posting-detail/job-posting-detail.component';
import { MyApplicationsComponent } from './pages/my-applications/my-applications.component';
import { MyJobPostingsComponent } from './pages/my-job-postings/my-job-postings.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SavedJobsComponent } from './pages/saved-jobs/saved-jobs.component';
import { UserListComponent } from './pages/user-list/user-list.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard', component: DashboardComponent },

  // Öffentlich lesbar, das Backend gibt GET /api/job-postings ohne Token frei.
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent, pathMatch: 'full' },

  // Arbeitgeber: eigene Inserate verwalten
  {
    path: 'my-job-postings', component: MyJobPostingsComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Employer] }
  },
  {
    path: 'job-posting', component: JobPostingDetailComponent, canActivate: [appCanActivate],
    pathMatch: 'full', data: { roles: [AppRoles.Employer] }
  },
  {
    path: 'job-posting/:id', component: JobPostingDetailComponent, canActivate: [appCanActivate],
    pathMatch: 'full', data: { roles: [AppRoles.Employer] }
  },
  {
    path: 'job-postings/:id/applications', component: JobPostingApplicationsComponent,
    canActivate: [appCanActivate], data: { roles: [AppRoles.Employer] }
  },

  // Arbeitssuchender: eigene Bewerbungen und Merkliste.
  // Kein ADMIN, weil diese Seiten die lokale userId brauchen.
  {
    path: 'my-applications', component: MyApplicationsComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.JobSeeker] }
  },
  {
    path: 'saved-jobs', component: SavedJobsComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.JobSeeker] }
  },

  // Eigenes Profil, ebenfalls userId-abhängig
  {
    path: 'profile', component: ProfileComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Employer, AppRoles.JobSeeker] }
  },

  // Admin: globale Ansichten, kommen ohne userId aus
  {
    path: 'users', component: UserListComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Admin] }
  },
  {
    path: 'all-applications', component: AllApplicationsComponent, canActivate: [appCanActivate],
    data: { roles: [AppRoles.Admin] }
  },

  { path: 'noaccess', component: NoAccessComponent },
  { path: '**', redirectTo: '' },
];
