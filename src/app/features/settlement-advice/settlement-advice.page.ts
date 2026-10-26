import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {SettlementAdviceService} from './settlement-advice.service';
import {saveBlob} from '../../core/download';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">INSURANCE / SETTLEMENT ADVICE</div>
        <h1>Settlement Advice</h1>
      </div>
    </div>

    @if (error) {
      <div class="notice">{{ error }}</div>
    }

    @if (message) {
      <div class="success">{{ message }}</div>
    }

    <div class="panel padded form-panel">

      <h2>Settlement Advice</h2>

      <p>Available after the claim settlement is paid.</p>

      <label>Settlement ID</label>

      <input
        class="field"
        type="number"
        [(ngModel)]="settlementId"
      />

      <button
        class="btn primary"
        (click)="download()"
        [disabled]="!settlementId"
      >
        Download Advice PDF
      </button>

    </div>
  `
})
export class SettlementAdvicePage implements OnInit {

  private api = inject(SettlementAdviceService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  settlementId = 0;

  ngOnInit() {

    this.settlementId = Number(
      this.route.snapshot.queryParamMap.get('settlementId')
    ) || 0;

    const claimId = Number(
      this.route.snapshot.queryParamMap.get('id')
    ) || 0;

    if (!this.settlementId && claimId) {

      this.api.getSettlement(claimId).subscribe({
        next: r => {
          this.settlementId = r.settlementId;
        },
        error: e => {
          this.error = errorText(e);
        }
      });

    }
  }

  download() {

    this.api.download(this.settlementId).subscribe({
      next: blob => {
        saveBlob(
          blob,
          `settlement-advice-${this.settlementId}.pdf`
        );
      },
      error: e => {
        this.error = errorText(e);
      }
    });

  }

}