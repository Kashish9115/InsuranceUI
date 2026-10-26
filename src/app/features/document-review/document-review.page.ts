import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {DocumentReviewService} from './document-review.service';
import {saveBlob} from '../../core/download';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './document-review.page.html',
  })
 export class DocumentReviewPage implements OnInit {

  private api = inject(DocumentReviewService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  id = 0;
  docs: ClaimDocument[] = [];

  ngOnInit() {
    this.id = Number(
      this.route.snapshot.queryParamMap.get('id')
    ) || 0;

    if (this.id) {
      this.reload();
    }
  }

  reload() {
    if (!this.id) {
      return;
    }

    this.api.list(this.id).subscribe({
      next: r => {
        this.docs = r ?? [];
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  review(d: ClaimDocument, status: 'VERIFIED' | 'REJECTED') {
    this.api.verify(this.id, d.documentId, status).subscribe({
      next: () => {
        this.message = 'Document ' + status;
        this.reload();
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  
download(d: ClaimDocument) {

  this.error = '';

  this.api.download(this.id, d.documentId).subscribe({

    next: response => {

      const blob = response.body;

      if (!blob) {
        this.error = 'Downloaded file is empty';
        return;
      }

      const disposition = response.headers.get('Content-Disposition');

      let filename = `claim-document-${d.documentId}`;

      const match = disposition?.match(/filename="?([^";]+)"?/i);

      if (match) {
        filename = match[1];
      } else {
        const extensions: Record<string, string> = {
          'application/pdf': '.pdf',
          'image/png': '.png',
          'image/jpeg': '.jpg'
        };

        filename += extensions[blob.type] || '';
      }

      saveBlob(blob, filename);

    },

    error: e => {
      this.error = errorText(e);
    }

  });

}

}