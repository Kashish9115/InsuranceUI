import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, ClaimDocument } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class DocumentReviewService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  list(id: number) {
    return this.http.get<ApiResponse<ClaimDocument[]> | ClaimDocument[]>(
      this.base + `/claims/${id}/documents`
    ).pipe(
      map(unwrap)
    );
  }

  verify(id: number, doc: number, status: 'VERIFIED' | 'REJECTED') {
    return this.http.patch(
      this.base + `/claims/${id}/documents/verify`,
      {
        documentId: doc,
        verificationStatus: status
      }
    );
  }

  
  download(id: number, doc: number) {
  return this.http.get(
    this.base + `/claims/${id}/documents/${doc}/download`,
    {
      responseType: 'blob',
      observe: 'response' as const
    }
  );
}

}