import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './user/dashboard/dashboard.component';
import { UserEditComponent } from './user/user-edit/user-edit.component';

const routes: Routes = [
  { path: 'users', component: DashboardComponent, data: { animation: 'Dashboard' } },
  { path: 'user/:id', component: UserEditComponent, data: { animation: 'UserEdit' } },
  { path: 'user', component: UserEditComponent, data: { animation: 'UserEdit' } },
  { path: '', pathMatch: 'full', redirectTo: 'users' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
