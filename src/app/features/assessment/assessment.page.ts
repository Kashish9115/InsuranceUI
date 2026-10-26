import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {AssessmentService} from './assessment.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">INSURANCE / ASSESSMENT</div>
        <h1>Assessment</h1>
      
      </div>
    </div>

    @if (error) {
      <div class="notice">{{ error }}</div>
    }

    @if (message) {
      <div class="success">{{ message }}</div>
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
          (click)="load()"
        >
          Load Assessment
        </button>
      </div>

      <div class="section-heading">
        <h2>Assessment</h2>
        <p>
          Documents must be verified first.
          Coverage ID is used by backend to calculate deductible.
        </p>
      </div>

      @if (assessment) {
        <div class="details">

          <div>
            <span>Assessed</span>
            <b>{{ assessment.assessedAmount | currency:'INR' }}</b>
          </div>

          <div>
            <span>Deductible</span>
            <b>{{ assessment.deductible | currency:'INR' }}</b>
          </div>

          <div>
            <span>Net Payable</span>
            <b>{{ assessment.netPayable | currency:'INR' }}</b>
          </div>

        </div>
      }

      <div class="form-grid">

        <div>
          <label>Coverage ID</label>
          <input
            class="field"
            type="number"
            [(ngModel)]="coverageId"
          />
        </div>

        <div>
          <label>Assessed Amount</label>
          <input
            class="field"
            type="number"
            [(ngModel)]="amount"
          />
        </div>

      </div>

      <div class="form-actions">

        <button
          class="btn primary"
          (click)="create()"
          [disabled]="!id || !coverageId || amount <= 0"
        >
          Create Assessment
        </button>

        <button
          class="btn outline"
          (click)="update()"
          [disabled]="!assessment"
        >
          Update Assessment
        </button>

      </div>

      <div class="section-heading">
        <h2>Admin Decision</h2>
        <p>Assessment is separate from claim approval</p>
      </div>

      <label>Remarks / Rejection Reason</label>

      <textarea
        class="field"
        [(ngModel)]="remarks"
      ></textarea>

      <div class="form-actions">

        <button
          class="btn primary"
          [disabled]="!assessment"
          (click)="approve()"
        >
          Approve Claim
        </button>

        <button
          class="btn outline"
          (click)="reject()"
        >
          Reject Claim
        </button>

      </div>

    </div>
  `
})
export class AssessmentPage implements OnInit {

  private api = inject(AssessmentService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  id = 0;
  coverageId = 0;
  amount = 0;
  remarks = '';

  assessment: Assessment | null = null;

  ngOnInit() {
    this.id = Number(this.route.snapshot.queryParamMap.get('id')) || 0;

    if (this.id) {
      this.load();
    }
  }

  load() {
    if (!this.id) {
      return;
    }

    this.api.get(this.id).subscribe({
      next: r => {
        this.assessment = r;
        this.amount = r.assessedAmount || 0;
        this.coverageId = r.coverageId || this.coverageId;
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  create() {
    this.api.create(this.id, this.amount, this.coverageId).subscribe({
      next: () => {
        this.message = 'Assessment saved';
        this.load();
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  update() {
    this.api.update(this.id, this.amount, this.coverageId).subscribe({
      next: () => {
        this.message = 'Assessment updated';
        this.load();
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  approve() {
    this.api.approve(this.id, this.remarks).subscribe({
      next: () => {
        this.message = 'Claim approved';

        this.router.navigate(['/admin/settlement'], {
          queryParams: {id: this.id}
        });
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  reject() {
    this.api.reject(this.id, this.remarks).subscribe({
      next: () => {
        this.message = 'Claim rejected';
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

}