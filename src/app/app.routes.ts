import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { VerificationEmailComponent } from './components/verification-email/verification-email.component';
import { UserComponent } from './user/user.component';

export const routes: Routes = [
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {path: 'login', component: LoginComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'verification-email', component: VerificationEmailComponent},
  {path: 'user', component: UserComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: 'product-management', component: ProductManagementComponent}
];
