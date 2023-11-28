import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectPageComponent } from './project-page/project-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ProjectResolver } from './resolvers/project.resolver';
import { AddUserComponent } from './add-user/add-user.component';
import { ProjectTaskPageComponent } from './project-task-page/project-task-page.component';
import { TaskResolver } from './resolvers/task.resolver';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  {path: '', component:HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component:LoginComponent, canActivate: [AuthGuard]},
  {path: 'adduser', component:AddUserComponent, canActivate: [AuthGuard]},
  {path: 'editusers', component:EditUserComponent, canActivate: [AuthGuard]},
  {path: 'project/create', component:CreateProjectComponent, canActivate: [AuthGuard]},
  {path: 'project/:id', component: ProjectPageComponent, canActivate: [AuthGuard], resolve: {project: ProjectResolver}},
  {path: 'task/:id', component: ProjectTaskPageComponent, canActivate: [AuthGuard], resolve: {task: TaskResolver}},
  {path: '**', component:ErrorPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
