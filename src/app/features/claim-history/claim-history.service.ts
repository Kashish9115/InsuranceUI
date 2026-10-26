import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, History } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ClaimHistoryService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getHistory(id: number) {
    return this.http.get<ApiResponse<History[]> | History[]>(
      this.base + `/claims/${id}/history`
    ).pipe(
      map(unwrap)
    );
  }

}