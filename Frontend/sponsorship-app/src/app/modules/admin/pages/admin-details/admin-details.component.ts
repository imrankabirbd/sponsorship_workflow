import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/core/services/admin.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { SponsorshipRequest, WorkflowHistory } from 'src/app/shared/models/request.model';

@Component({
  selector: 'app-admin-details',
  templateUrl: './admin-details.component.html',
  styleUrls: ['./admin-details.component.css']
})
export class AdminDetailsComponent {
  requestId: number = 0;
  request: SponsorshipRequest | null = null;
  history: WorkflowHistory[] = [];
  isLoading = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadRequestDetails();
    this.loadRequestHistory();
  }

  loadRequestDetails() {
    this.isLoading = true;
    this.adminService.getRequestById(this.requestId).subscribe({
      next: (request) => {
        request.status = this.mapStatusToString(Number(request.status));
        this.request = new SponsorshipRequest(request);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
        alert('Error loading request details');
      }
    });
  }

  loadRequestHistory() {
    this.isLoading = true;
    this.adminService.getRequestHistory(this.requestId).subscribe({
      next: (request) => {
        this.history = request.map(request => {
          if (typeof request.oldStatus === 'number') {
            request.oldStatus = this.mapStatusToString(request.oldStatus);
          }
          if (typeof request.newStatus === 'number') {
            request.newStatus = this.mapStatusToString(request.newStatus);
          }
          return request;
        });
        console.log(this.history);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.isLoading = false;
        alert('Error loading request details');
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

  goBack() {
    this.router.navigate(['/admin/all-requests']);
  }

  getActionText(action: string): string {
    switch (action) {
      case 'SUBMIT': return 'Submitted';
      case 'MANAGER_APPROVE': return 'Approved by Manager';
      case 'MANAGER_REJECT': return 'Rejected by Manager';
      case 'FINANCE_APPROVE': return 'Approved by Finance';
      case 'FINANCE_REJECT': return 'Rejected by Finance';
      case 'CANCLE_REQUEST': return 'Cancled by Requestor';
      default: return action;
    }
  }
}
