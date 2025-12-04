import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Todo } from 'src/app/models/Todo';
import { TodoService } from 'src/app/services/todo.service';
import {
  faArrowAltCircleLeft, faBell, faBook, faBox, faCalendarAlt, faCircle, faCog, faComments, faDoorOpen,
  faEdit, faEnvelope, faListCheck, faNewspaper, faPaperPlane, faPhone, faPlus, faRocket, faSave, faShield, faShieldAlt, faTimes, faTrash, faTrophy, faUser
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-incompletedtodo',
  templateUrl: './edit-incompletedtodo.component.html',
  styleUrls: ['./edit-incompletedtodo.component.css']
})
export class EditIncompletedtodoComponent {
  todo: Todo = {
    id: 0,
    title: '',
    description: '',
    groupName: '',
    completed: false,
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private todoService: TodoService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.todoService.getTodoByTodoId(+id).subscribe({
        next: todo => {
          this.todo = todo;
          this.isLoading = false;
        },
        error: err => {
          this.errorMessage = 'Failed to load todo.';
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }

  onSubmit(): void {
    this.todoService.updateTodo(this.todo).subscribe({
      next: () => this.router.navigate(['/template']),
      error: err => console.error('Error updating todo', err)
    });
  }

  onCancel(): void {
    this.router.navigate(['/template']);
  }
  fauser = faUser;
      fagroup=faComments;
            fapub=faNewspaper;
              fabox = faBox;
              faedit = faEdit;
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
              fatimes=faTimes;
              farock=faRocket;
              famiss=faListCheck;
              fasave=faSave;
              fashield=faShieldAlt;
              fapaper=faPaperPlane;
              faenv=faEnvelope;
              facog=faCog;
              faTrophy=faTrophy;
         logout(){
              localStorage.removeItem('token');
              localStorage.removeItem('email');
              this.router.navigate(['/login']);
            }
}
