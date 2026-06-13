import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { SponsorshipRequest } from 'src/app/shared/models/request.model';

@Component({
  selector: 'app-all-requests',
  templateUrl: './all-requests.component.html',
  styleUrls: ['./all-requests.component.css']
})
export class AllRequestsComponent {
  requests: SponsorshipRequest[] = [];
  isLoading = false;
  filterStatus: string = 'all';

  constructor(private adminService: AdminService, private router: Router) {

  }

  ngOnInit() {
    this.loadAllRequests();
  }

  loadAllRequests() {
    this.isLoading = true;
    this.adminService.getAllRequests().subscribe({
      next: (requests) => {
        this.requests = requests.map(request => {
          if (typeof request.status === 'number') {
            request.status = this.mapStatusToString(request.status);
          }
          return request;
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
      }
    });
  }

  mapStatusToString(status: number): string {
    const statusMap: { [key: number]: string } = {
      1: 'Draft',
      2: 'PendingManager',
      3: 'PendingFinance',
      4: 'Approved',
      5: 'Rejected',
      6: 'Cancelled'
    };
    return statusMap[status] || 'Draft';
  }

  get filteredRequests(): SponsorshipRequest[] {
    if (this.filterStatus === 'all') {
      return this.requests;
    }
    return this.requests.filter(r => r.status === this.filterStatus);
  }

  viewDetails(id: number) {
    this.router.navigate(['/admin/detail', id]);
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Draft': return 'badge-secondary';
      case 'PendingManager': return 'badge-warning';
      case 'PendingFinance': return 'badge-info';
      case 'Approved': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-light';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'Draft': return 'Draft';
      case 'PendingManager': return 'Pending Manager';
      case 'PendingFinance': return 'Pending Finance';
      case 'Approved': return 'Approved';
      case 'Rejected': return 'Rejected';
      case 'Cancelled': return 'Cancelled';
      default: return status;
    }
  }
}
