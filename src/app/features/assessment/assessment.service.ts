import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, Assessment } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class AssessmentService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  create(id: number, assessedAmount: number, coverageId: number) {
    return this.http.post(
      this.base + `/claims/${id}/assessment`,
      { assessedAmount, coverageId }
    );
  }

  get(id: number) {
    return this.http.get<ApiResponse<Assessment> | Assessment>(
      this.base + `/claims/${id}/assessment`
    ).pipe(
      map(unwrap)
    );
  }

  update(id: number, assessedAmount: number, coverageId: number) {
    return this.http.put(
      this.base + `/claims/${id}/assessment`,
      { assessedAmount, coverageId }
    );
  }

  approve(id: number, remarks: string) {
    return this.http.put(
      this.base + `/claims/${id}/approve`,
      { remarks }
    );
  }

  reject(id: number, reason: string) {
    return this.http.put(
      this.base + `/claims/${id}/reject`,
      { reason }
    );
  }

}