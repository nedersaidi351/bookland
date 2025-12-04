import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faBell, faBook, faBox, faComments, faDoorOpen, faEnvelope, faListCheck, faLock, faNewspaper, faShieldAlt, faUser } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
     this.userForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      confpassword: ['']
    }, { validator: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode = true;
      this.userService.getUser(+id).subscribe(user => {
        this.userForm.patchValue({
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email
        });
        if (user.email) {
          this.loadImage(user.email);
        }
      });
        // Make password fields optional in edit mode
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('confpassword')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confpassword')?.updateValueAndValidity();
    } else {
      // For new users, require password
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      this.userForm.get('confpassword')?.setValidators([Validators.required]);
      this.userForm.get('password')?.updateValueAndValidity();
      this.userForm.get('confpassword')?.updateValueAndValidity();
    }
    }
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confpassword')?.value;

    // Only validate if both fields have values
    if (password || confirmPassword) {
      return password === confirmPassword ? null : { passwordMismatch: true };
    }
    return null;
  }

  loadImage(email: string): void {
    this.userService.getImage(email).subscribe(
      imageBlob => {
        const reader = new FileReader();
        reader.onload = () => {
          this.previewUrl = reader.result;
        };
        reader.readAsDataURL(imageBlob);
      },
      error => {
        this.previewUrl = 'assets/default-avatar.png';
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.userForm.invalid) return;

    const formData = this.userForm.value;
    
    // In edit mode, remove password fields if they're empty
    if (this.isEditMode) {
      if (!formData.password) {
        delete formData.password;
        delete formData.confpassword;
      }
    }

    const email = formData.email;

    if (this.isEditMode) {
      const id = this.route.snapshot.params['id'];
      this.userService.updateUser(id, formData).subscribe({
        next: () => {
          if (this.selectedFile && email) {
            this.uploadImage(email);
          } else {
            this.router.navigate(['/users']);
          }
        },
        error: err => console.error('Error updating user', err)
      });
    } else {
      this.userService.createUser(formData).subscribe({
        next: (user) => {
          if (this.selectedFile && email) {
            this.uploadImage(email);
          } else {
            this.router.navigate(['/users']);
          }
        },
        error: err => console.error('Error creating user', err)
      });
    }
  }
  

  uploadImage(email: string): void {
    if (!this.selectedFile) {
      this.router.navigate(['/users']);
      return;
    }

    this.userService.uploadImage(email, this.selectedFile).subscribe({
      next: () => this.router.navigate(['/users']),
      error: err => {
        console.error('Error uploading image', err);
        this.router.navigate(['/users']);
      }
    });
  }
    navigateToUserList(): void {
    this.router.navigate(['/users']);
  }
  

  fauser=faUser;
  fabox=faBox;
  faenvelope=faEnvelope;
  fabook=faBook;
  falock=faLock;
  fanot=faBell;
  fashield=faShieldAlt;
  fagroup=faComments;
  fapub=faNewspaper;
  fadoor=faDoorOpen;
  famiss=faListCheck;
  
    logout(){
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        this.router.navigate(['/login']);
      }
}
