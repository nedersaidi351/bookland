import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './Page1/acceuil/acceuil.component';
import { LoginComponent } from './Page1/login/login.component';
import { SignupComponent } from './Page1/signup/signup.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactComponent } from './contact/contact.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TimerComponent } from './timer/timer.component';
import { MessageComponent } from './message/message.component';
import { HomeComponent } from './home/home.component';
import { JWT_OPTIONS, JwtHelperService } from '@auth0/angular-jwt';
import { ProfileComponent } from './profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TodoComponent } from './todo/todo.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';

import { NotificationSenderComponent } from './notification-sender/notification-sender.component';
import { NotificationComponent } from './admin/notification/notification.component';
import { AddBookComponent } from './admin/add-book/add-book.component';
import { BookListComponent } from './admin/book-list/book-list.component';
import { MarketComponent } from './market/market.component';
import { TimeTrackerComponent } from './time-tracker/time-tracker.component';
import { MyBooksComponent } from './my-books/my-books.component';
import { ChatComponent } from './chat/chat.component';
import { EditBookComponent } from './admin/edit-book/edit-book.component';
import { EditTodoComponent } from './admin/edit-todo/edit-todo.component';
import { EditIncompletedtodoComponent } from './admin/edit-incompletedtodo/edit-incompletedtodo.component';
import { TemplateComponent } from './admin/template/template.component';
import { PostsComponent } from './admin/posts/posts.component';
import { TemplateAddComponent } from './admin/template-add/template-add.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { GroupComponent } from './admin/group/group.component';



@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    LoginComponent,
    SignupComponent,
    ContactComponent,
    TimerComponent,
    MessageComponent,
    HomeComponent,
    ProfileComponent,
    TodoComponent,
    UserListComponent,
    UserFormComponent,
    UserDetailsComponent,
  
    NotificationSenderComponent,
       NotificationComponent,
       AddBookComponent,
       BookListComponent,
       MarketComponent,
       TimeTrackerComponent,
       MyBooksComponent,
       ChatComponent,
       EditBookComponent,
       EditTodoComponent,
       EditIncompletedtodoComponent,
       TemplateComponent,
       PostsComponent,
       TemplateAddComponent,
       BookDetailsComponent,
       GroupComponent,
      
       
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    

  ],
  providers: [  { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
    JwtHelperService  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
