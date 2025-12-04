// edit-todo.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { TodoTemplate } from 'src/app/models/TodoTemplate ';
import { TodoService } from 'src/app/services/todo.service';
import {
  faArrowAltCircleLeft, faBell, faBook, faBox, faCalendarAlt, faCircle, faCog, faComments, faDoorOpen,
  faEdit, faEnvelope, faListCheck, faNewspaper, faPhone, faPlus, faSave, faShield, faShieldAlt, faTimes, faTrash, faTrophy, faUser
} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-edit-todo',
  templateUrl: './edit-todo.component.html',
  styleUrls: ['./edit-todo.component.css']
})
export class EditTodoComponent implements OnInit {
     todo: TodoTemplate = {
    title: '',
    description: '',
    groupName: ''
  };

  errorMessage = '';
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.todoService.getTodoById(+id).pipe(
        catchError(error => {
          this.errorMessage = 'Failed to load todo template.';
          console.error('API Error:', error);
          return of(null);
        })
      ).subscribe(template => {
        this.isLoading = false;
        if (template) {
          this.todo = template;
        } else {
          this.errorMessage = 'Todo template not found';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.todo.id) {
      this.todoService.updateTemplate(this.todo.id, this.todo).subscribe({
        next: () => this.router.navigate(['/template']),
        error: err => console.error('Error updating template', err)
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/template']);
  }
  fauser = faUser;
      fagroup=faComments;
      fapub=faNewspaper;
        fabox = faBox;
        faedit = faEdit;
        fasave=faSave;
        fatimes=faTimes;
        faCalendarAlt = faCalendarAlt;
        fatrash = faTrash;
        facircle = faCircle;
        faArrowLeft = faArrowAltCircleLeft;
        faPhone = faPhone;
        faShieldAlt = faShieldAlt;
        fadoor = faDoorOpen;
        fanot=faBell;
        faplus=faPlus;
        fabook=faBook;
        famiss=faListCheck;
        fashield=faShieldAlt;
        faenv=faEnvelope;
        facog=faCog;
        faTrophy=faTrophy;
         logout(){
              localStorage.removeItem('token');
              localStorage.removeItem('email');
              this.router.navigate(['/login']);
            }
}