import { Component } from '@angular/core';
import { TodoTemplate } from 'src/app/models/TodoTemplate ';
import { TodoService } from 'src/app/services/todo.service';
import {
  faArrowAltCircleLeft, faBell, faBook, faBox, faCalendarAlt, faCircle, faCog, faComments, faDoorOpen,
  faEdit, faEnvelope, faListCheck, faNewspaper, faPaperPlane, faPhone, faPlus, faRocket, faShield, faShieldAlt, faTimes, faTrash, faTrophy, faUser
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-template-add',
  templateUrl: './template-add.component.html',
  styleUrls: ['./template-add.component.css']
})
export class TemplateAddComponent {
   template: TodoTemplate = {
    title: '',
    description: '',
    groupName: ''
  };

  constructor(private todoService: TodoService,private router: Router) {}

onSubmit() {
  this.todoService.addTodoTemplate(this.template).subscribe({
    next: (res) => {
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Défis ajouté avec succès !'
      });
      this.template = { title: '', description: '', groupName: '' }; // reset form
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Échec de l’ajout du template.'
      });
    }
  });
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
        fashield=faShieldAlt;
        fapaper=faPaperPlane;
        faenv=faEnvelope;
        facog=faCog;
        faTrophy=faTrophy;
        goToTemplate() {
  this.router.navigate(['/template']);
}
         logout(){
              localStorage.removeItem('token');
              localStorage.removeItem('email');
              this.router.navigate(['/login']);
            }
}
