import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { FinanceService } from 'src/app/core/services/finance.service';
import { ApprovalDto, SponsorshipRequest } from 'src/app/shared/models/request.model';

@Component({
  selector: 'app-finance-details',
  templateUrl: './finance-details.component.html',
  styleUrls: ['./finance-details.component.css']
})
export class FinanceDetailsComponent {
  financeForm: FormGroup;
  requestId: number = 0;
  userId: number = 0;
  request: SponsorshipRequest | null = null;
  isLoading = false;
  isApproving = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router,
    private financeService: FinanceService, private auth: AuthService) {
    this.financeForm = fb.group({
      remarks: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.auth.getCurrentUserId();
    this.loadRequestDetails();
  }

  get f() { return this.financeForm.controls; }

  loadRequestDetails() {
    this.isLoading = true;
    this.financeService.getRequestById(this.requestId).subscribe({
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
    return this.request?.status === 'PendingFinance';
  }

  goBack() {
    this.router.navigate(['/manager/pending']);
  }

  onApproved() {
    if (!this.canSubmit()) {
      alert('Only pending manager requests can be approved');
      return;
    }

    const submitData = new ApprovalDto({
      requestId: this.requestId,
      userId: this.userId,
      remarks: this.financeForm.value.remarks
    });

    if (confirm('Are you sure you want to approve this request?')) {
      this.isApproving = true;
      this.financeService.approve(submitData).subscribe({
        next: (res) => {
          this.isApproving = false;
          alert(res.message);
          this.router.navigate(['/finance/review']);
        },
        error: (error) => {
          this.isApproving = false;
          alert(error.error?.message || 'Error submitting request');
        }
      });
    }
  }

  rejectRequest(id: number) {
      const submitData = new ApprovalDto({
      requestId: this.requestId,
      userId: this.userId,
      remarks: this.financeForm.value.remarks
    });

    if (confirm('Are you sure you want to reject this request?')) {
      this.isApproving = true;
      this.financeService.reject(submitData).subscribe({
        next: (res) => {
          this.isApproving = false;
          alert(res.message);
          this.router.navigate(['/finance/review']);
        },
        error: (error) => {
          this.isApproving = false;
          alert(error.error?.message || 'Error submitting request');
        }
      });
    }
  }
}
