import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Gestion des Orphelins';
  isSidebarOpen: boolean = true;

  constructor(public authService: AuthService, public router: Router) {


    this.checkScreenSize();
  }

  ngOnInit(): void {

    window.addEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    this.isSidebarOpen = window.innerWidth > 768;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
