import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, Claim } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ClaimListService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getAll() {
    return this.http.get<ApiResponse<Claim[]> | Claim[]>(
      this.base + '/claims'
    ).pipe(
      map(unwrap)
    );
  }

  getOne(id: number) {
    return this.http.get<ApiResponse<Claim> | Claim>(
      this.base + '/claims/' + id
    ).pipe(
      map(unwrap)
    );
  }

}