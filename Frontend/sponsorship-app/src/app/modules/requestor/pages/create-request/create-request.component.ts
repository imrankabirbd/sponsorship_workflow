import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RequestorService } from 'src/app/core/services/requestor.service';
import { SponsorshipTypeService } from 'src/app/core/services/sponsorship-type.service';
import { CreateRequestDto } from 'src/app/shared/models/request.model';
import { SponsorshipTypeModel } from 'src/app/shared/models/sponsorship-type.model';

@Component({
  selector: 'app-create-request',
  templateUrl: './create-request.component.html',
  styleUrls: ['./create-request.component.css']
})
export class CreateRequestComponent implements OnInit {
  requestForm: FormGroup;
  requestId: number = 0;
  maxAmount: number = 0;
  isLoading = false;
  submitted = false;
  isSaving = false;
  isUpdating = false;
  departments: string[];
  sponsorshipTypesList: SponsorshipTypeModel[] = [];

  constructor(private fb: FormBuilder, private requestorService: RequestorService,
    private router: Router, private route: ActivatedRoute, private spTypeService: SponsorshipTypeService) {
    this.departments = ['Marketing', 'Sales', 'HR', 'IT', 'Finance', 'Operations'];

    this.requestForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      department: ['', Validators.required],
      sponsorshipTypeId: ['', Validators.required],
      eventName: ['', Validators.required],
      eventDate: ['', Validators.required],
      requestedAmount: ['', [Validators.required, Validators.min(4), Validators.max(1000000)]],
      justification: ['', [Validators.required, Validators.minLength(10)]],
      expectedBenefit: [''],
      remarks: ['']
    });
  }

  ngOnInit(): void {
    this.loadspType();

    this.requestId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.requestId > 0) {
      this.isUpdating = true;
      this.loadRequestData();
    }
    else {
      this.isUpdating = false;
    }
  }

  get f() { return this.requestForm.controls; }

  loadspType(){
    this.spTypeService.getAll().subscribe({
      next:(resp) => {
        this.sponsorshipTypesList = resp;
      },
      error:(error) => {
        console.log(error);
        alert('Failed to load data');
      }
    });
  }

  spTypeChange(id: number){
   const data =  this.sponsorshipTypesList.find(f=>f.id == id);
   this.maxAmount = data?.maxAmount ?? 0;
   alert('For this sponsorship type you can get max amount: ' + this.maxAmount);
  }

  validateMaxAmt(amt: number){
    if(this.maxAmount == 0){
      this.requestForm.patchValue({ requestedAmount: 0 });
      alert('Please select sponsorship type');
    }
    if(amt > this.maxAmount && this.maxAmount > 0){
     this.requestForm.patchValue({ requestedAmount: 0 });
      alert('Please enter amount bellow: ' + this.maxAmount);
    }
  }

  saveAsDraft() {
    this.submitted = true;

    if (this.requestForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.isSaving = true;

    const requestData = new CreateRequestDto({
      title: this.requestForm.value.title,
      requestorId: Number(localStorage.getItem('userId')),
      department: this.requestForm.value.department,
      sponsorshipTypeId: this.requestForm.value.sponsorshipTypeId,
      eventName: this.requestForm.value.eventName,
      eventDate: this.requestForm.value.eventDate,
      requestedAmount: this.requestForm.value.requestedAmount,
      justification: this.requestForm.value.justification,
      expectedBenefit: this.requestForm.value.expectedBenefit,
      remarks: this.requestForm.value.remarks
    });

    this.requestorService.createRequest(requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Request created successfully!');
        this.router.navigate(['/requestor/my-requests']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating request:', error);
        alert('Error creating request. Please try again.');
      }
    });
  }

  onReset() {
    this.submitted = false;
    this.requestForm.reset();
  }

  loadRequestData() {
    this.isLoading = true;
    this.requestorService.getRequestById(this.requestId).subscribe({
      next: (request) => {
        this.requestForm.patchValue({
          title: request.title,
          department: request.department,
          sponsorshipTypeId: request.sponsorshipTypeId,
          eventName: request.eventName,
          eventDate: request.eventDate,
          requestedAmount: request.requestedAmount,
          justification: request.justification,
          expectedBenefit: request.expectedBenefit,
          remarks: request.remarks
        });
        this.spTypeChange(Number(this.requestForm.value.sponsorshipTypeId));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        alert('Error loading request details');
      }
    });
  }

  updateRequest(){
    this.submitted = true;

    if (this.requestForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.isUpdating = true;

    const requestData = new CreateRequestDto({
      title: this.requestForm.value.title,
      requestorId: Number(localStorage.getItem('userId')),
      department: this.requestForm.value.department,
      sponsorshipTypeId: this.requestForm.value.sponsorshipTypeId,
      eventName: this.requestForm.value.eventName,
      eventDate: this.requestForm.value.eventDate,
      requestedAmount: this.requestForm.value.requestedAmount,
      justification: this.requestForm.value.justification,
      expectedBenefit: this.requestForm.value.expectedBenefit,
      remarks: this.requestForm.value.remarks
    });

    this.requestorService.updateRequest(this.requestId, requestData).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Request updated successfully!');
        this.router.navigate(['/requestor/my-requests']);
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating request:', error);
        alert('Error creating request. Please try again.');
      }
    });
  }
}
