import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userName: string = '';
  userRole: string = '';
  currentDateTime: Date = new Date();
  notificationCount: number = 3;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUserRole();

    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userName = user.fullName || user.username || 'User';

    // Update time every second
    setInterval(() => {
      this.currentDateTime = new Date();
    }, 1000);
  }

  getNotifications(): string[] {
    return [
      'New Notification',
      'New Notification',
      'New Notification'
    ];
  }

  getRoleIcon(): string {
    switch(this.userRole) {
      case 'Requestor': return 'fas fa-user';
      case 'Manager': return 'fas fa-user-tie';
      case 'FinanceAdmin': return 'fas fa-chart-line';
      case 'SystemAdmin': return 'fas fa-crown';
      default: return 'fas fa-user';
    }
  }

  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar?.classList.toggle('collapsed');
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToProfile() {
    //this.router.navigate(['/profile']);
  }

  goToSettings(){

  }
}
