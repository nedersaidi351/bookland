import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faCalendar, faComment, faHeart, faSearch, faTrash,faBell, faBook, faBox, faCircle,  faComments, faDoorOpen, faEdit, faEye, faListCheck, faNewspaper, faShieldAlt,  faUser } from '@fortawesome/free-solid-svg-icons';
import { BlogService } from 'src/app/services/blog.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[] = [];
  userEmail: string = '';
  faCalendar = faCalendar;
  faHeart = faHeart;
  faTrash = faTrash;

  constructor(private postService: BlogService,private router: Router) {}

  ngOnInit(): void {
    this.loadUserEmail();
    this.fetchPosts();
  }

  loadUserEmail() {
    const user = localStorage.getItem('user');
    if (user) {
      this.userEmail = JSON.parse(user).email;
    }
  }

  fetchPosts(): void {
    this.postService.getPosts().subscribe(
      (data: any[]) => {
        this.posts = data;
      },
      (error) => {
        console.error('Error fetching posts:', error);
      }
    );
  }

  likePost(post: any): void {
    if (post.likedByCurrentUser) {
      Swal.fire('You already liked this post!');
      return;
    }

    this.postService.likePost(post.id, this.userEmail).subscribe(
      () => {
        post.likes++;
        post.likedByCurrentUser = true;
      },
      (error) => {
        console.error('Error liking post:', error);
      }
    );
  }

  deletePost(post: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won’t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.postService.deletePost(post.id).subscribe(
          () => {
            this.posts = this.posts.filter(p => p.id !== post.id);
            Swal.fire('Deleted!', 'Your post has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting post:', error);
          }
        );
      }
    });
  }
  faSearch=faSearch;
  faComment=faComment;
  fauser=faUser;
    fabox=faBox;
    faeyes=faEye;
    faedit=faEdit;
    fatrash=faTrash;
    fabook=faBook;
    fanot=faBell;
    fashield=faShieldAlt;
    famiss=faListCheck;
    facircle=faCircle;
    fagroup=faComments;
    fapub=faNewspaper;
    fadoor=faDoorOpen;
      logout(){
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          this.router.navigate(['/login']);
        }
}
