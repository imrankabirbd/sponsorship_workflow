import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { RequestorService } from 'src/app/core/services/requestor.service';
import { SponsorshipRequest, SubmitDto } from 'src/app/shared/models/request.model';

@Component({
  selector: 'app-request-detail',
  templateUrl: './request-detail.component.html',
  styleUrls: ['./request-detail.component.css']
})
export class RequestDetailComponent implements OnInit {
  requestId: number = 0;
  userId: number = 0;
  request: SponsorshipRequest | null = null;
  isLoading = false;
  isSubmitting = false;

  constructor(
    private route: ActivatedRoute,
    private requestorService: RequestorService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.authService.getCurrentUserId();
    this.loadRequestDetails();
  }

  loadRequestDetails() {
    this.isLoading = true;
    this.requestorService.getRequestById(this.requestId).subscribe({
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

  canSubmit(): boolean {
    return this.request?.status === 'Draft';
  }

  onSubmit() {
    if (!this.canSubmit()) {
      alert('Only draft requests can be submitted');
      return;
    }

    const submitData = new SubmitDto({
      requestId: this.requestId,
      userId: this.userId
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

  goBack() {
    this.router.navigate(['/requestor/my-requests']);
  }

  editRequest(id: number) {
    this.router.navigate(['/requestor/edit', id]);
  }
}
