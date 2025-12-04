import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './Page1/acceuil/acceuil.component';
import { LoginComponent } from './Page1/login/login.component';
import { SignupComponent } from './Page1/signup/signup.component';
import { ContactComponent } from './contact/contact.component';
import { authGuard } from './serives/auth/auth.guard';
import { TimerComponent } from './timer/timer.component';
import { MessageComponent } from './message/message.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { TodoComponent } from './todo/todo.component';
import { UserListComponent } from './admin/user-list/user-list.component';
import { UserFormComponent } from './admin/user-form/user-form.component';
import { UserDetailsComponent } from './admin/user-details/user-details.component';
import { AdminGuard } from './guards/admin.guard';

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



const routes: Routes = [
  { path: '', redirectTo: 'acceuil', pathMatch: 'full' },
   { 
    path: 'users',
    component: UserListComponent,
    canActivate: [AdminGuard] 
  },
  { 
    path: 'post',
    component: PostsComponent,
    canActivate: [AdminGuard] 
  },
  { 
    path: 'group',
    component: GroupComponent,
    canActivate: [AdminGuard] 
  },

  { 
    path: 'users/new',
    component: UserFormComponent,
    canActivate: [AdminGuard] 
  },
  { 
    path: 'users/edit/:id',
    component: UserFormComponent,
    canActivate: [AdminGuard] 
  },
  { 
    path: 'users/:id',
    component: UserDetailsComponent,
    canActivate: [AdminGuard] 
  },
   { 
    path: 'not',
    component: NotificationSenderComponent,
    canActivate: [AdminGuard] 
  },
   { 
    path: 'notification',
    component: NotificationComponent,
    canActivate: [AdminGuard] 
  },
   { 
    path: 'add-book',
    component: AddBookComponent,
    canActivate: [AdminGuard] 
  },
     { 
    path: 'book-list',
    component: BookListComponent,
    canActivate: [AdminGuard] 
  },
    { 
    path: 'add-template',
    component: TemplateAddComponent,
    canActivate: [AdminGuard] 
  },
  { 
    path: 'template',
    component: TemplateComponent,
    canActivate: [AdminGuard] 
  },
   { 
    path: 'template/edit/:id',
    component: EditTodoComponent ,
    canActivate: [AdminGuard] 
  },
   { 
    path: 'todo/edit/:id', component: EditIncompletedtodoComponent ,

    canActivate: [AdminGuard] 
  },
    { 
    path: 'chats',
    component: ChatComponent,
    canActivate: [authGuard] 
  },
  
  {path:"acceuil",component:AcceuilComponent},
  {path:"login",component:LoginComponent},
  {path:"signup",component:SignupComponent},
  {path:"contact",component:ContactComponent,canActivate: [authGuard]},
  {path:"timer",component:TimeTrackerComponent,canActivate:[authGuard]},
  {path:"message",component:MessageComponent,canActivate:[authGuard]},
  {path:"home",component:HomeComponent,canActivate:[authGuard]},
  {path:"profile",component:ProfileComponent,canActivate:[authGuard]},
  {path:"mission",component:TodoComponent,canActivate: [authGuard] },
  {path:"market",component:MarketComponent,canActivate: [authGuard]},
  {path:"book",component:MyBooksComponent,canActivate: [authGuard]},
  {path:"books/:id",component:BookDetailsComponent,canActivate: [authGuard]},
   { path: 'edit-book/:id', component: EditBookComponent,canActivate: [AdminGuard] }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
