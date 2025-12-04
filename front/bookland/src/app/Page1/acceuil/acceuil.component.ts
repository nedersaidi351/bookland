import { Component, HostListener } from '@angular/core';
import{faUser,faLock,faGlobe} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.css']
})
export class AcceuilComponent {
  faglobe=faGlobe;

  isScrolled = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {

    this.isScrolled = window.scrollY > 50;
   
  }

}
