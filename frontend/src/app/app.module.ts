import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthenticationService } from './services/authentication.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptorService } from './services/AuthInterceptor.service';
import { AuthGuard } from './guards/auth.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectService } from './services/project.service';
import { ProjectPageComponent } from './project-page/project-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ProjectResolver } from './resolvers/project.resolver';
import { UserService } from './services/user.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ProjectTeamMembersSelectionDialogComponent } from './project-team-members-selection-dialog/project-team-members-selection-dialog.component';
import { DialogService } from './services/dialog.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AddUserComponent } from './add-user/add-user.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ProjectTasksAdditionDialogComponent } from './project-tasks-addition-dialog/project-tasks-addition-dialog.component';
import { TaskService } from './services/task.service';
import { ProjectTaskPageComponent } from './project-task-page/project-task-page.component';
import { TaskResolver } from './resolvers/task.resolver';
import { ProjectFinishDialogComponent } from './project-finish-dialog/project-finish-dialog.component';
import { TaskFinishDialogComponent } from './task-finish-dialog/task-finish-dialog.component';
import { TaskCommentComponent } from './task-comment/task-comment.component';
import { TaskCommentReplyDialogComponent } from './task-comment-reply-dialog/task-comment-reply-dialog.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { MatTableModule } from '@angular/material/table';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';
import {MatInputModule} from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    LoginComponent,
    CreateProjectComponent,
    ProjectPageComponent,
    ErrorPageComponent,
    ProjectTeamMembersSelectionDialogComponent,
    AddUserComponent,
    ProjectTasksAdditionDialogComponent,
    TaskCommentReplyDialogComponent,
    ProjectTaskPageComponent,
    ProjectFinishDialogComponent,
    TaskFinishDialogComponent,
    TaskCommentComponent,
    EditUserComponent,
    EditUserDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatSelectModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatInputModule
  ],
  providers: [
    AuthenticationService,
    AuthGuard,
    ProjectService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    ProjectResolver,
    TaskResolver,
    UserService,
    DialogService,
    TaskService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
