import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateProjectComponent } from './create-project/create-project.component';

const routes: Routes = [
  {path: '', component:HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent, canActivate: [AuthGuard]},
  {path: 'project/create', component:CreateProjectComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
