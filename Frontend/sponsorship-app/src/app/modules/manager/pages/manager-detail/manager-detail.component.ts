import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ManagerService } from 'src/app/core/services/manager.service';
import { ApprovalDto, SponsorshipRequest } from 'src/app/shared/models/request.model';

@Component({
  selector: 'app-manager-detail',
  templateUrl: './manager-detail.component.html',
  styleUrls: ['./manager-detail.component.css']
})
export class ManagerDetailComponent implements OnInit {
  managerForm: FormGroup;
  requestId: number = 0;
  userId: number = 0;
  request: SponsorshipRequest | null = null;
  isLoading = false;
  isApproving = false;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private managerService: ManagerService, private auth: AuthService) {
    this.managerForm = fb.group({
      remarks: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.auth.getCurrentUserId();
    this.loadRequestDetails();
  }

  get f() { return this.managerForm.controls; }

  loadRequestDetails() {
    this.isLoading = true;
    this.managerService.getRequestById(this.requestId).subscribe({
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
    return this.request?.status === 'PendingManager';
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
      remarks: this.managerForm.value.remarks
    });

    if (confirm('Are you sure you want to approve this request?')) {
      this.isApproving = true;
      this.managerService.approve(submitData).subscribe({
        next: (res) => {
          this.isApproving = false;
          alert(res.message);
          this.router.navigate(['/manager/pending']);
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
      remarks: this.managerForm.value.remarks
    });

    if (confirm('Are you sure you want to reject this request?')) {
      this.isApproving = true;
      this.managerService.reject(submitData).subscribe({
        next: (res) => {
          this.isApproving = false;
          alert(res.message);
          this.router.navigate(['/manager/pending']);
        },
        error: (error) => {
          this.isApproving = false;
          alert(error.error?.message || 'Error submitting request');
        }
      });
    }
  }
}
