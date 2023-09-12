import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';

const routes: Routes = [
  { path: 'users', component: DashboardComponent },
  { path: 'users/:id', component: UserDetailComponent },
  { path: 'user/:id', component: UserEditComponent },
  { path: 'user', component: UserEditComponent },
  {path: '', pathMatch: 'full', redirectTo: 'users'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
