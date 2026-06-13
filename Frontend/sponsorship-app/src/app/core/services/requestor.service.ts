import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CreateRequestDto, SponsorshipRequest, SubmitDto } from 'src/app/shared/models/request.model';

@Injectable({
  providedIn: 'root'
})
export class RequestorService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRequestById(id: number): Observable<SponsorshipRequest> {
    return this.http.get<SponsorshipRequest>(`${this.apiUrl}/Requestor/${id}`);
  }

  createRequest(requestData: CreateRequestDto): Observable<any> {
    return this.http.post(`${this.apiUrl}/Requestor`, requestData);
  }

  submitRequest(submitData: SubmitDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/Requestor/submit`, submitData);
  }

  updateRequest(id: number, requestData: Partial<CreateRequestDto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/Requestor/${id}`, requestData);
  }

  cancelRequest(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/Requestor/${id}/cancel`, {});
  }

  getMyRequests(userId: number): Observable<SponsorshipRequest[]> {
    return this.http.get<SponsorshipRequest[]>(`${this.apiUrl}/Requestor/${userId}/get-by-user`);
  }
}
