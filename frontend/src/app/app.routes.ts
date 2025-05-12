import { Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { LoginComponent } from '../features/auth/login/login.component';
import { RegisterComponent } from '../features/auth/register/register.component';
import { DashboardComponent } from '../features/dashboard/dashboard.component';
import { SettingsComponent } from '../features/settings/settings.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    children: [
      { path: 'home', component: DashboardComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' }
    ]
  },
  { path: 'settings', component: SettingsComponent },
  { path: '', redirectTo: '/dashboard/home', pathMatch: 'full' }
]; 