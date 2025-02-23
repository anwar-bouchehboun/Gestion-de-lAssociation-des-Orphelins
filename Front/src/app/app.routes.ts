import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { authGuard } from './guard/auth.guard';
import { loginGuard } from './guard/login.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ActivitesComponent } from './components/activites/activites.component';
import { RoleGuard } from './guard/role.guard';
import { OrphelinsListComponent } from './components/orphelins/orphelins-list.component';
import { StatistiquesComponent } from './components/statistiques/statistiques.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [loginGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: 'orphelins',
    component: OrphelinsListComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'GESTIONNAIRE', 'COLLABORATEUR'] },
  },
  {
    path: 'orphelins/new',
    loadComponent: () =>
      import('./components/orphelins/orphelin-form.component').then(
        (m) => m.OrphelinFormComponent
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'GESTIONNAIRE'] },
  },
  {
    path: 'orphelins/edit/:id',
    loadComponent: () =>
      import('./components/orphelins/orphelin-form.component').then(
        (m) => m.OrphelinFormComponent
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'GESTIONNAIRE'] },
  },
  {
    path: 'activites',
    component: ActivitesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'GESTIONNAIRE', 'COLLABORATEUR'] },
  },
  {
    path: 'activite/new',
    loadComponent: () =>
      import('./components/activites/activite-form.component').then(
        (m) => m.ActiviteFormComponent
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'GESTIONNAIRE'] },
  },
  {
    path: 'activites/edit/:id',
    loadComponent: () =>
      import('./components/activites/activite-form.component').then(
        (m) => m.ActiviteFormComponent
      ),
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN', 'GESTIONNAIRE'] },
  },
  {
    path: 'statistiques',
    component: StatistiquesComponent,
    canActivate: [RoleGuard],
    data: { roles: ['ADMIN'] },
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
