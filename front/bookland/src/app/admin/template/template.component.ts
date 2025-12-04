import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TodoInfoDTO } from 'src/app/models/TodoInfoDTO';

import {
  faArrowAltCircleLeft, faBell, faBook, faBox, faCalendarAlt, faCircle, faCog, faComments, faDoorOpen,
  faEdit, faEnvelope, faListCheck, faNewspaper, faPhone, faPlus, faShield, faShieldAlt, faTrash, faTrophy, faUser
} from '@fortawesome/free-solid-svg-icons';
import { TodoService } from 'src/app/services/todo.service';
import Swal from 'sweetalert2';
import { TodoTemplate } from 'src/app/models/TodoTemplate ';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
  templates: TodoTemplate[] = [];
  incompleteTodos: TodoInfoDTO[] = [];
  completedTodos: any[] = [];

  // Font Awesome icons
  fauser = faUser;
  fagroup = faComments;
  fapub = faNewspaper;
  fabox = faBox;
  faedit = faEdit;
  faCalendarAlt = faCalendarAlt;
  fatrash = faTrash;
  facircle = faCircle;
  faArrowLeft = faArrowAltCircleLeft;
  faPhone = faPhone;
  faShieldAlt = faShieldAlt;
  fadoor = faDoorOpen;
  fanot = faBell;
  faplus = faPlus;
  fabook = faBook;
  famiss = faListCheck;
  fashield = faShieldAlt;
  faenv = faEnvelope;
  facog = faCog;
  faTrophy = faTrophy;

  constructor(
    private todoService: TodoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadTemplates();
    this.loadIncompleteTodos();
    this.loadCompletedTodos();
  }

  loadTemplates(): void {
    this.todoService.getTodoTemplates().subscribe({
      next: data => this.templates = data,
      error: err => console.error('Error loading templates', err)
    });
  }

  loadIncompleteTodos(): void {
    this.todoService.getIncompleteTodosInfo().subscribe({
      next: data => this.incompleteTodos = data,
      error: err => console.error('Failed to fetch incomplete todos', err)
    });
  }

  loadCompletedTodos(): void {
    this.todoService.getCompletedTodosInfo().subscribe({
      next: data => this.completedTodos = data,
      error: err => console.error('Failed to fetch completed todos', err)
    });
  }

  editTemplate(id: number): void {
    this.router.navigate(['/template/edit', id]);
  }

  editIncompleteTodo(id: number): void {
    this.router.navigate(['/todo/edit', id]);
  }

  deleteTemplate(id: number): void {
  Swal.fire({
    title: 'Confirm Deletion',
    text: 'This will permanently delete the template',
    icon: 'warning',
    showCancelButton: true
  }).then((result) => {
    if (result.isConfirmed) {
      this.todoService.deleteTemplate(id).subscribe({
        next: () => {
          this.templates = this.templates.filter(t => t.id !== id);
          Swal.fire('Deleted!', 'Template removed', 'success');
        },
        error: (err) => {
          console.error('Delete error:', err);
          let errorMsg = 'Failed to delete template';
          if (err.status === 404) {
            errorMsg = 'Template not found';
          } else if (err.status === 403) {
            errorMsg = 'Permission denied';
          }
          Swal.fire('Error!', errorMsg, 'error');
        }
      });
    }
  });
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
  }
}