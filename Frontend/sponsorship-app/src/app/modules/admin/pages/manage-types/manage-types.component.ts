import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SponsorshipTypeService } from 'src/app/core/services/sponsorship-type.service';
import { SponsorshipTypeModel } from 'src/app/shared/models/sponsorship-type.model';

@Component({
  selector: 'app-manage-types',
  templateUrl: './manage-types.component.html',
  styleUrls: ['./manage-types.component.css']
})
export class ManageTypesComponent implements OnInit{
  spTypeForm : FormGroup;
  spTypeList: SponsorshipTypeModel[] = [];
  isSaving = false;
  isUpdating = false;
  isLoading = false;
  submitted = false;
  id: number = 0;


  constructor(private fb: FormBuilder, private router: Router, private spTypeService: SponsorshipTypeService){
    this.spTypeForm = this.fb.group({
      typeName: ['',[Validators.required]],
      description: ['',[Validators.required]],
      maxAmount: ['',[Validators.required, Validators.pattern('^[0-9]*$'), Validators.min(1000), Validators.max(1000000)]]
    });
  }

  ngOnInit(): void {
    this.getAll();
  }

  get f() { return this.spTypeForm.controls }

  getAll(){
    this.spTypeService.getAll().subscribe({
      next:(resp) => {
        this.spTypeList = resp;
      },
      error:(error) => {
        console.log(error);
        alert('Failed to load data');
      }
    });
  }

  onSave(){
    this.isSaving = true;
    this.isLoading = true;
    this.submitted = true;

    if(this.spTypeForm.invalid){
      return;
    }

    const formData = new SponsorshipTypeModel({
      typeName: this.spTypeForm.value.typeName,
      description: this.spTypeForm.value.description,
      maxAmount: this.spTypeForm.value.maxAmount
    });

    this.spTypeService.create(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
         this.isSaving = false;
        alert('Sponsorship Type created successfully!')
        this.onReset();
        this.getAll();
      },

      error: (error) => {
        this.isLoading = false;
        console.log(error);
        alert('Error creating request. Please try again.')
      }
    });
  }

  onUpdate(){
    this.isUpdating = true;
    this.isLoading = true;
    this.submitted = true;

    if(this.spTypeForm.invalid){
      return;
    }

    const formData = new SponsorshipTypeModel({
      typeName: this.spTypeForm.value.typeName,
      description: this.spTypeForm.value.description,
      maxAmount: this.spTypeForm.value.maxAmount
    });

    this.spTypeService.update(this.id, formData).subscribe({
      next: (response) => {
        this.isLoading = false;
         this.isUpdating = false;
        alert('Sponsorship Type updated successfully!')
        this.onReset();
        this.getAll();
      },

      error: (error) => {
        this.isLoading = false;
        console.log(error);
        alert('Error creating request. Please try again.')
      }
    });
  }

  onEdit(id: number, typeName: string, desc: string, maxAmt: number){
    this.id = id;
    this.isUpdating = true;
    this.spTypeForm.patchValue({
      typeName: typeName,
      description: desc,
      maxAmount: maxAmt
    });
  }

  onReset(){
    this.submitted = false;
    this.spTypeForm.reset();
  }
}
