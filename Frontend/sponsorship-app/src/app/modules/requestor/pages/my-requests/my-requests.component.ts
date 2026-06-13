import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RequestorService } from 'src/app/core/services/requestor.service';
import { SponsorshipRequest, SubmitDto } from 'src/app/shared/models/request.model';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.component.html',
  styleUrls: ['./my-requests.component.css']
})
export class MyRequestsComponent implements OnInit {
  requests: SponsorshipRequest[] = [];
  userId: number = 0;
  isLoading = false;
  isSubmitting = false;
  filterStatus: string = 'all';

  constructor(private authService: AuthService, private requestorService: RequestorService, private router: Router) {

  }

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.loadMyRequests();
  }

  loadMyRequests() {
    this.isLoading = true;
    this.requestorService.getMyRequests(this.userId).subscribe({
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
    this.router.navigate(['/requestor/detail', id]);
  }

  submitRequest(id: number, userId: number) {
    const submitData = new SubmitDto({
      requestId: id,
      userId: userId
    });

    if (confirm('Are you sure you want to submit this request for approval?')) {
      this.isSubmitting = true;
      this.requestorService.submitRequest(submitData).subscribe({
        next: () => {
          this.isSubmitting = false;
          alert('Request submitted successfully!');
          this.router.navigate(['/requestor/my-requests']);
        },
        error: (error) => {
          this.isSubmitting = false;
          alert(error.error?.message || 'Error submitting request');
        }
      });
    }
  }

  editRequest(id: number) {
    this.router.navigate(['/requestor/edit', id]);
  }

  cancelRequest(id: number) {
    if (confirm('Are you sure you want to cancel this request?')) {
      this.requestorService.cancelRequest(id).subscribe({
        next: () => {
          alert('Request cancelled successfully');
          this.loadMyRequests();
        },
        error: (error) => {
          alert(error.error?.message || 'Error cancelling request');
        }
      });
    }
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
