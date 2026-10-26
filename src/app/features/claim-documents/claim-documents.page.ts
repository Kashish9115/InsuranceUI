import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {ClaimDocumentsService} from './claim-documents.service';
import {saveBlob} from '../../core/download';
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">
          INSURANCE / CLAIM DOCUMENTS
        </div>

        <h1>Claim Documents</h1>

      </div>
    </div>

    @if (error) {
      <div class="notice">
        {{ error }}
      </div>
    }

    @if (message) {
      <div class="success">
        {{ message }}
      </div>
    }

    <div class="panel padded form-panel">

      <label>Claim ID</label>

      <div class="inline-form">
        <input
          class="field"
          type="number"
          [(ngModel)]="id"
        />

        <button
          class="btn outline"
          (click)="reload()"
        >
          Load Documents
        </button>
      </div>

      <div class="section-heading">
        <h2>My Documents</h2>
        <p>Upload and track verification status</p>
      </div>

      @for (d of docs; track d.documentId) {

        <div class="doc-row">

          <div class="file-icon">
            ▤
          </div>

          <div class="grow">
            <b>{{ d.documentName }}</b>
          </div>

          <span
            class="badge"
            [attr.data-status]="d.verificationStatus"
          >
            {{ d.verificationStatus }}
          </span>

          <button
            class="btn outline"
            (click)="download(d)"
          >
            Download
          </button>

          @if (d.verificationStatus === 'PENDING') {
            <button
              class="btn outline"
              (click)="remove(d)"
            >
              Delete
            </button>
          }

        </div>

      } @empty {

        <p>No documents uploaded.</p>

      }

      <div class="upload">

        <div>⇧</div>

        <b>Upload supporting document</b>

        <p>PDF, JPG, PNG · Maximum 5 MB</p>

        <input
          class="field"
          placeholder="Document type e.g. HOSPITAL_BILL"
          [(ngModel)]="documentName"
        />

        <input
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          (change)="choose($event)"
        />

        <button
          class="btn primary"
          [disabled]="!file || !id || saving"
          (click)="upload()"
        >
          Upload
        </button>

      </div>

    </div>
  `
})
export class ClaimDocumentsPage implements OnInit {

  private api = inject(ClaimDocumentsService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  id = 0;

  docs: ClaimDocument[] = [];

  documentName = 'HOSPITAL_BILL';

  file: File | null = null;

  saving = false;

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

  choose(e: Event) {

    this.file =
      (e.target as HTMLInputElement).files?.[0] || null;

  }

  upload() {

    if (!this.file || !this.id) {
      return;
    }

    this.saving = true;

    this.api.upload(
      this.id,
      this.documentName,
      this.file
    ).subscribe({

      next: () => {

        this.saving = false;

        this.message = 'Document uploaded';

        this.file = null;

        this.reload();

      },

      error: e => {

        this.saving = false;

        this.error = errorText(e);

      }

    });

  }

  remove(d: ClaimDocument) {

    this.api.remove(
      this.id,
      d.documentId
    ).subscribe({

      next: () => {
        this.reload();
      },

      error: e => {
        this.error = errorText(e);
      }

    });

  }

  download(d: ClaimDocument) {

    this.api.download(
      this.id,
      d.documentId
    ).subscribe({

      next: blob => {
        saveBlob(blob, d.documentName);
      },

      error: e => {
        this.error = errorText(e);
      }

    });

  }

}