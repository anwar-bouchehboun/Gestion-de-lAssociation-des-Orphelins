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
  description?: string;
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
      description: 'Vue générale du système',
    },
    {
      label: 'Gestion Utilisateurs',
      icon: 'people',
      route: '/users',
      roles: ['ADMIN'],
      description: 'Gestion des utilisateurs (Admin uniquement)',
    },
    {
      label: 'Orphelins',
      icon: 'child_care',
      route: '/orphelins',
      roles: ['ADMIN', 'GESTIONNAIRE', 'COLLABORATEUR'],
      description: 'Gestion des orphelins',
    },
    {
      label: 'Tuteurs',
      icon: 'supervisor_account',
      route: '/tuteurs',
      roles: ['ADMIN'],
      description: 'Gestion des tuteurs (Admin uniquement)',
    },
    {
      label: 'Activités',
      icon: 'event',
      route: '/activites',
      roles: ['ADMIN', 'GESTIONNAIRE', 'COLLABORATEUR'],
      description: 'Gestion des activités',
    },
    {
      label: 'Dons',
      icon: 'volunteer_activism',
      route: '/dons',
      roles: ['ADMIN', 'GESTIONNAIRE'],
      description: 'Gestion des dons',
    },
    {
      label: 'Rapports',
      icon: 'assessment',
      route: '/rapports',
      roles: ['ADMIN', 'GESTIONNAIRE'],
      description: 'Gestion des rapports',
    },
    {
      label: 'Statistiques',
      icon: 'bar_chart',
      route: '/statistiques',
      roles: ['ADMIN'],
      description: 'Statistiques du système (Admin uniquement)',
    },
  ];

  constructor(private authService: AuthService) {
    this.userRole = this.authService.getUserRole() || '';
    console.log('Role actuel:', this.userRole);
  }

  ngOnInit(): void {
    if (!this.userRole) {
      this.userRole = this.authService.getUserRole() || '';
      console.log('Role après init:', this.userRole);
    }
  }

  isMenuItemVisible(roles: string[]): boolean {
    if (!this.userRole) return false;
    const userRoleUpper = this.userRole.toUpperCase();
    return roles.includes(userRoleUpper);
  }
}
