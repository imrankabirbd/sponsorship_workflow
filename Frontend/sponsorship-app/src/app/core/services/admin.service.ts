import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SponsorshipRequest, WorkflowHistory } from 'src/app/shared/models/request.model';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

    getRequestById(id: number): Observable<SponsorshipRequest> {
      return this.http.get<SponsorshipRequest>(`${this.apiUrl}/Admin/${id}`);
    }

    getAllRequests(): Observable<SponsorshipRequest[]> {
      return this.http.get<SponsorshipRequest[]>(`${this.apiUrl}/Admin/all`);
    }

    getRequestHistory(requestId: number): Observable<WorkflowHistory[]> {
      return this.http.get<WorkflowHistory[]>(`${this.apiUrl}/Admin/${requestId}/history`);
    }
}
