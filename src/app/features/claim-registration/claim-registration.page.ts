import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {ClaimRegistrationService} from './claim-registration.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">INSURANCE / CLAIM REGISTRATION</div>
        <h1>Claim Registration</h1>
      </div>
    </div>

    @if (error) {
      <div class="notice">{{ error }}</div>
    }

    @if (message) {
      <div class="success">{{ message }}</div>
    }

    <div class="panel padded form-panel">

      <form (ngSubmit)="submit()">

        <div class="form-grid">

          <div>
            <label>Customer ID</label>
            <input
              class="field"
              type="number"
              name="customerId"
              [(ngModel)]="customerId"
              required
            />
          </div>

          <div>
            <label>Policy ID</label>
            <input
              class="field"
              type="number"
              name="policyId"
              [(ngModel)]="policyId"
              required
            />
          </div>

          <div>
            <label>Coverage ID</label>
            <input
              class="field"
              type="number"
              name="coverageId"
              [(ngModel)]="coverageId"
              required
            />
          </div>

          <div>
            <label>Claim Type</label>
            <select
              class="field"
              name="claimType"
              [(ngModel)]="claimType"
            >
              <option>HEALTH</option>
              <option>LIFE</option>
              <option>MOTOR</option>
            </select>
          </div>

          <div>
            <label>Estimated Loss</label>
            <input
              class="field"
              type="number"
              name="estimatedLoss"
              [(ngModel)]="estimatedLoss"
              min="1"
              required
            />
          </div>

          <div>
            <label>Incident Date</label>
            <input
              class="field"
              type="date"
              name="incidentDate"
              [(ngModel)]="incidentDate"
              [max]="today"
              required
            />
          </div>

          <div class="span2">
            <label>Description</label>
            <textarea
              class="field"
              name="description"
              [(ngModel)]="description"
            ></textarea>
          </div>

        </div>

        <div class="form-actions">
          <button
            class="btn primary"
            [disabled]="saving || !customerId || !policyId || !coverageId || estimatedLoss <= 0"
          >
            {{ saving ? 'Submitting...' : 'Register Claim →' }}
          </button>
        </div>

      </form>

    </div>
  `
})
export class ClaimRegistrationPage implements OnInit {

  private api = inject(ClaimRegistrationService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  customerId = 0;
  policyId = 0;
  coverageId = 0;

  claimType = 'HEALTH';

  estimatedLoss = 0;
  incidentDate = '';
  description = '';

  saving = false;


  today = new Date().toLocaleDateString('en-CA');
  ngOnInit() {}

  submit() {

    this.saving = true;
    this.error = '';

    this.api.register({
      customerId: this.customerId,
      policyId: this.policyId,
      coverageId: this.coverageId,
      claimType: this.claimType,
      estimatedLoss: this.estimatedLoss,
      incidentDate: this.incidentDate,
      description: this.description
    }).subscribe({

      next: r => {

        this.saving = false;

        const id = r?.claimId;

        this.message = 'Claim registered';

        if (id) {
          const role = this.router.url.split('/')[1];

          this.router.navigate(['/', role, 'documents'], {
            queryParams: {id}
          });
        }

      },

      error: e => {
        this.saving = false;
        this.error = errorText(e);
      }

    });

  }

}