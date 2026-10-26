import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, Settlement, BankDetails } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class SettlementService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  get(id: number) {
    return this.http.get<ApiResponse<Settlement> | Settlement>(
      this.base + `/claims/${id}/settlement`
    ).pipe(
      map(unwrap)
    );
  }

  bank(id: number, body: BankDetails) {
    return this.http.post(
      this.base + `/claims/${id}/bank-details`,
      body
    );
  }

  getBank(id: number) {
    return this.http.get(
      this.base + `/claims/${id}/bank-details`
    );
  }

  verifyBank(id: number) {
    return this.http.post(
      this.base + `/claims/${id}/bank/verify`,
      {}
    );
  }

  create(id: number, mode: string) {
    return this.http.post<ApiResponse<Settlement> | Settlement>(
      this.base + `/claims/${id}/settlement`,
      { paymentMode: mode }
    ).pipe(
      map(unwrap)
    );
  }

  disburse(id: number) {
    return this.http.post(
      this.base + `/settlements/${id}/disburse`,
      {}
    );
  }

  payoutStatus(id: number) {
    return this.http.get(
      this.base + `/settlements/${id}/status`
    );
  }

}