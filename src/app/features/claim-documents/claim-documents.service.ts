import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, unwrap, ClaimDocument } from '../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ClaimDocumentsService {

  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  list(id: number) {
    return this.http.get<ApiResponse<ClaimDocument[]> | ClaimDocument[]>(
      this.base + `/claims/${id}/documents`
    ).pipe(
      map(unwrap)
    );
  }

  upload(id: number, name: string, file: File) {
    const form = new FormData();

    form.append('documentName', name);
    form.append('file', file);

    return this.http.post(
      this.base + `/claims/${id}/documents`,
      form
    );
  }

  remove(id: number, doc: number) {
    return this.http.delete(
      this.base + `/claims/${id}/documents/${doc}`
    );
  }

  download(id: number, doc: number) {
    return this.http.get(
      this.base + `/claims/${id}/documents/${doc}/download`,
      { responseType: 'blob' }
    );
  }

}