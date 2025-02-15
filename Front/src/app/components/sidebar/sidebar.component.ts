import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  roles: string[];
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatListModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  menuItems: MenuItem[] = [
    {
      label: 'Tableau de bord',
      icon: 'dashboard',
      route: '/dashboard',
      roles: ['ADMIN', 'GESTIONNAIRE', 'COLLABORATEUR'],
    },
    {
      label: 'Gestion Utilisateurs',
      icon: 'people',
      route: '/users',
      roles: ['ADMIN'],
    },
    {
      label: 'Orphelins',
      icon: 'child_care',
      route: '/orphelins',
      roles: ['ADMIN', 'GESTIONNAIRE', 'COLLABORATEUR'],
    },
    {
      label: 'Tuteurs',
      icon: 'supervisor_account',
      route: '/tuteurs',
      roles: ['ADMIN', 'GESTIONNAIRE'],
    },
    {
      label: 'Activités',
      icon: 'event',
      route: '/activites',
      roles: ['ADMIN', 'GESTIONNAIRE', 'COLLABORATEUR'],
    },
    {
      label: 'Dons',
      icon: 'volunteer_activism',
      route: '/dons',
      roles: ['ADMIN', 'GESTIONNAIRE'],
    },
    {
      label: 'Rapports',
      icon: 'assessment',
      route: '/rapports',
      roles: ['ADMIN', 'GESTIONNAIRE'],
    },
    {
      label: 'Statistiques',
      icon: 'bar_chart',
      route: '/statistiques',
      roles: ['ADMIN'],
    },
  ];

  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole() || '';
    console.log('Role actuel:', this.userRole); // Pour le débogage
  }

  ngOnInit(): void {
    // Vérifier si le rôle est défini
    if (!this.userRole) {
      this.userRole = this.authService.getUserRole() || '';
      console.log('Role après init:', this.userRole);
    }
  }

  isMenuItemVisible(roles: string[]): boolean {
    console.log(
      'Vérification pour les rôles:',
      roles,
      'Role utilisateur:',
      this.userRole
    );
    return roles.includes(this.userRole);
  }
}
