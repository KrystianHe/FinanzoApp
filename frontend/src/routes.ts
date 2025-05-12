import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { VerifyComponent } from './features/auth/verify/verify.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { TransactionListComponent } from './features/transactions/transaction-list.component';
import { BudgetListComponent } from './features/budget/budget-list.component';
import { ExpenseListComponent } from './features/expenses/expense-list/expense-list.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify', component: VerifyComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { path: 'transactions', component: TransactionListComponent, canActivate: [AuthGuard] },
  { path: 'budgets', component: BudgetListComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpenseListComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '' }
]; 