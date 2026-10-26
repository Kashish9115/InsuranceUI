import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, Settlement } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class SettlementAdviceService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getSettlement(claimId: number) {
    return this.http.get<ApiResponse<Settlement> | Settlement>(
      this.base + `/claims/${claimId}/settlement`
    ).pipe(
      map(unwrap)
    );
  }

  download(id: number) {
    return this.http.get(
      this.base + `/settlements/${id}/advice`,
      {
        responseType: 'blob'
      }
    );
  }

}