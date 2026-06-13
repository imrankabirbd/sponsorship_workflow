import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { SponsorshipTypeModel } from 'src/app/shared/models/sponsorship-type.model';

@Injectable({
  providedIn: 'root'
})
export class SponsorshipTypeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  create(sponsorshipType: SponsorshipTypeModel){
    return this.http.post(`${this.apiUrl}/SponsorshipType`, sponsorshipType);
  }

  update(id:number, sponsorshipType: SponsorshipTypeModel){
    return this.http.put(`${this.apiUrl}/SponsorshipType/${id}`, sponsorshipType);
  }

  getAll(): Observable<SponsorshipTypeModel[]>{
    return this.http.get<SponsorshipTypeModel[]>(`${this.apiUrl}/SponsorshipType`);
  }

  getById(id: number): Observable<SponsorshipTypeModel>{
    return this.http.get<SponsorshipTypeModel>(`${this.apiUrl}/SponsorshipType/${id}`);
  }
}
