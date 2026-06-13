import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-deshboard',
  templateUrl: './deshboard.component.html',
  styleUrls: ['./deshboard.component.css']
})
export class DeshboardComponent implements OnInit {

  userRole: string = '';
  userName: string = '';

  // Common Stats
  stats = {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  };

  // Requestor Data
  recentRequests = [
    { id: 1, title: 'Tech Conference 2024', amount: 5000, status: 'Pending Manager', date: '2024-12-01' },
    { id: 2, title: 'Community Workshop', amount: 2000, status: 'Approved', date: '2024-11-28' },
    { id: 3, title: 'Charity Event', amount: 3000, status: 'Draft', date: '2024-11-25' }
  ];

  // Manager Data
  pendingRequests = [
    { id: 1, title: 'Tech Conference', requester: 'John Doe', amount: 5000, department: 'Marketing', submittedDate: '2024-12-01' },
    { id: 2, title: 'Workshop Event', requester: 'Jane Smith', amount: 3000, department: 'HR', submittedDate: '2024-11-30' }
  ];

  // Finance Data
  pendingFinance = [
    { id: 1, title: 'Tech Conference', requester: 'John Doe', amount: 5000, department: 'Marketing' },
    { id: 2, title: 'Annual Summit', requester: 'Sarah Lee', amount: 10000, department: 'Sales' }
  ];

  // Admin Data
  totalUsers = 24;
  totalRequests = 156;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userRole = this.authService.getCurrentUserRole();
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userName = user.fullName || user.username;
    this.loadStats();
  }

  loadStats() {
    this.stats = {
      total: 156,
      pending: 8,
      approved: 135,
      rejected: 13
    };
  }

  getRoleTitle(): string {
    switch(this.userRole) {
      case 'Requestor': return 'Requestor Dashboard';
      case 'Manager': return 'Manager Dashboard';
      case 'FinanceAdmin': return 'Finance Dashboard';
      case 'SystemAdmin': return 'Admin Dashboard';
      default: return 'Dashboard';
    }
  }

  getRoleDescription(): string {
    switch(this.userRole) {
      case 'Requestor': return 'Manage your sponsorship requests from here.';
      case 'Manager': return 'Review and approve pending sponsorship requests.';
      case 'FinanceAdmin': return 'Review and approve financial requests.';
      case 'SystemAdmin': return 'System overview and management.';
      default: return 'Welcome to your dashboard';
    }
  }

  getStatusClass(status: string): string {
    if (status.includes('Pending')) return 'badge-warning';
    if (status === 'Approved') return 'badge-success';
    if (status === 'Draft') return 'badge-info';
    return 'badge-secondary';
  }
}
