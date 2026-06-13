import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApprovalDto, SponsorshipRequest } from 'src/app/shared/models/request.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinanceService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getRequestById(id: number): Observable<SponsorshipRequest> {
      return this.http.get<SponsorshipRequest>(`${this.apiUrl}/Finance/${id}`);
    }

    getPendingRequests(): Observable<SponsorshipRequest[]> {
      return this.http.get<SponsorshipRequest[]>(`${this.apiUrl}/Finance/pending-finance`);
    }

    approve(approvalData: ApprovalDto): Observable<any> {
      return this.http.post(`${this.apiUrl}/Finance/approve`, approvalData);
    }

    reject(approvalData: ApprovalDto): Observable<any> {
      return this.http.post(`${this.apiUrl}/Finance/reject`, approvalData);
    }
}
