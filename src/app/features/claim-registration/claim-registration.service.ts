import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, Claim } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ClaimRegistrationService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  register(body: Record<string, unknown>) {
    return this.http.post<ApiResponse<Claim> | Claim>(
      this.base + '/claims/register',
      body
    ).pipe(
      map(unwrap)
    );
  }

}