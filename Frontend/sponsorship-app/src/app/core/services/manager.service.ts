import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApprovalDto, SponsorshipRequest } from 'src/app/shared/models/request.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ManagerService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

    getRequestById(id: number): Observable<SponsorshipRequest> {
      return this.http.get<SponsorshipRequest>(`${this.apiUrl}/Manager/${id}`);
    }

    getPendingRequests(): Observable<SponsorshipRequest[]> {
      return this.http.get<SponsorshipRequest[]>(`${this.apiUrl}/Manager/pending-manager`);
    }

    approve(approvalData: ApprovalDto): Observable<any> {
      return this.http.post(`${this.apiUrl}/Manager/approve`, approvalData);
    }

    reject(approvalData: ApprovalDto): Observable<any> {
      return this.http.post(`${this.apiUrl}/Manager/reject`, approvalData);
    }
}
