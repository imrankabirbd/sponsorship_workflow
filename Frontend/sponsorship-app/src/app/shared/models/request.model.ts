import { User } from "../../shared/models/user.model";

export class CreateRequestDto {
  title: string = '';
  requestorId: number = 0;
  department: string = '';
  sponsorshipTypeId: number = 0;
  eventName: string = '';
  eventDate: Date = new Date();
  requestedAmount: number = 0;
  justification: string = '';
  expectedBenefit: string = '';
  remarks: string = '';

  constructor(data?: Partial<CreateRequestDto>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  isValid(): boolean {
    return !!(
      this.title &&
      this.department &&
      this.sponsorshipTypeId &&
      this.eventName &&
      this.eventDate &&
      this.requestedAmount > 0 &&
      this.justification
    );
  }

  getFormattedAmount(): string {
    return `$${this.requestedAmount.toLocaleString()}`;
  }
}

export class SponsorshipRequest {
  id: number = 0;
  title: string = '';
  requestorId: number = 0;
  requestorName: string = '';
  department: string = '';
  sponsorshipTypeId: number = 0;
  sponsorshipTypeName: string = '';
  eventName: string = '';
  eventDate: Date = new Date();
  requestedAmount: number = 0;
  justification: string = '';
  expectedBenefit: string = '';
  remarks: string = '';
  status: string = '';
  createdAt: Date = new Date();
  submittedAt?: Date;
  managerRemarks?: string;
  financeRemarks?: string;

  constructor(data?: Partial<SponsorshipRequest>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  getStatusClass(): string {
    switch(this.status) {
      case 'Draft': return 'badge-secondary';
      case 'PendingManager': return 'badge-warning';
      case 'PendingFinance': return 'badge-info';
      case 'Approved': return 'badge-success';
      case 'Rejected': return 'badge-danger';
      case 'Cancelled': return 'badge-danger';
      default: return 'badge-light';
    }
  }

  getStatusText(): string {
    switch(this.status) {
      case 'Draft': return 'Draft';
      case 'PendingManager': return 'Pending Manager Approval';
      case 'PendingFinance': return 'Pending Finance Review';
      case 'Approved': return 'Approved';
      case 'Rejected': return 'Rejected';
      case 'Cancelled': return 'Cancelled';
      default: return this.status;
    }
  }

  canEdit(): boolean {
    return this.status === 'Draft';
  }

  canCancel(): boolean {
    return this.status === 'Draft' || this.status === 'PendingManager';
  }
}

export class SubmitDto {
  requestId: number = 0;
  userId: number = 0;

  constructor(data?: Partial<SubmitDto>) {
    Object.assign(this, data);
  }
}

export class ApprovalDto {
  requestId: number = 0;
  userId: number = 0;
  remarks: string = '';

  constructor(data?: Partial<ApprovalDto>) {
    Object.assign(this, data);
  }
}

export class WorkflowHistory {
  id: number = 0;
  requestId: number = 0;
  action: string = '';
  actorUserId: number = 0;
  actor: string = '';
  remarks: string = '';
  oldStatus: string = '';
  newStatus: string = '';
  timestamp: Date = new Date();
  createdAt: Date = new Date();

  constructor(data?: Partial<WorkflowHistory>) {
    Object.assign(this, data);
  }

  getActionIcon(): string {
    switch(this.action) {
      case 'SUBMIT': return 'fas fa-paper-plane';
      case 'MANAGER_APPROVE': return 'fas fa-check-circle';
      case 'MANAGER_REJECT': return 'fas fa-times-circle';
      case 'FINANCE_APPROVE': return 'fas fa-dollar-sign';
      case 'FINANCE_REJECT': return 'fas fa-ban';
      default: return 'fas fa-info-circle';
    }
  }

  getActionText(): string {
    switch(this.action) {
      case 'SUBMIT': return 'Submitted';
      case 'MANAGER_APPROVE': return 'Approved by Manager';
      case 'MANAGER_REJECT': return 'Rejected by Manager';
      case 'FINANCE_APPROVE': return 'Approved by Finance';
      case 'FINANCE_REJECT': return 'Rejected by Finance';
      default: return this.action;
    }
  }
}

export enum RequestStatus {
  Draft = 'Draft',
  PendingManager = 'PendingManager',
  PendingFinance = 'PendingFinance',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled'
}
