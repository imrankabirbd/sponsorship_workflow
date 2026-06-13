import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  userRole: string = '';
  userName: string = '';
  menuItems: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUserRole();
    this.loadMenuItems();

    // Get user name
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userName = user.fullName || user.username || 'User';
  }

  loadMenuItems() {
    switch(this.userRole) {
      case 'Requestor':
        this.menuItems = [
          { icon: 'fas fa-plus-circle', label: 'Create Request', route: '/requestor/create', active: false },
          { icon: 'fas fa-list-alt', label: 'My Requests', route: '/requestor/my-requests', active: false }
        ];
        break;

      case 'Manager':
        this.menuItems = [
          { icon: 'fas fa-clock', label: 'Pending Approvals', route: '/manager/pending', active: false }
        ];
        break;

      case 'FinanceAdmin':
        this.menuItems = [
          { icon: 'fas fa-money-bill-wave', label: 'Finance Review', route: '/finance/review', active: false }
        ];
        break;

      case 'SystemAdmin':
        this.menuItems = [
          { icon: 'fas fa-tasks', label: 'All Requests', route: '/admin/all-requests', active: false },
          { icon: 'fas fa-tags', label: 'Manage Types', route: '/admin/manage-types', active: false }
        ];
        break;

      default:
        this.menuItems = [];
    }
  }

  getUserInitials(): string {
    const names = this.userName.split(' ');
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return this.userName.substring(0, 2).toUpperCase();
  }

  getRoleBadgeClass(): string {
    switch(this.userRole) {
      case 'Requestor': return 'badge-info';
      case 'Manager': return 'badge-warning';
      case 'FinanceAdmin': return 'badge-success';
      case 'SystemAdmin': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }

  setActive(menuItem: any) {
    this.menuItems.forEach(item => item.active = false);
    menuItem.active = true;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
