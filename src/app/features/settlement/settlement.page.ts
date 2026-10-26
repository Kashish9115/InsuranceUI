import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {SettlementService} from './settlement.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">INSURANCE / SETTLEMENT</div>
        <h1>Settlement</h1>
      </div>
    </div>

    @if (error) {
      <div class="notice">{{ error }}</div>
    }

    @if (message) {
      <div class="success">{{ message }}</div>
    }

    <div class="two-col">

      <div class="panel padded">

        <div class="section-heading">
          <h2>Claim Settlement</h2>
          <p>Approved claims only</p>
        </div>

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
            Load
          </button>
        </div>

        @if (settlement) {

          <div class="details">

            <div>
              <span>Settlement ID</span>
              <b>{{ settlement.settlementId }}</b>
            </div>

            <div>
              <span>Amount</span>
              <b>{{ settlement.approvedAmount | currency:'INR' }}</b>
            </div>

            <div>
              <span>Status</span>
              <b>{{ settlement.settlementStatus }}</b>
            </div>

          </div>

        }

        <div class="section-heading">
          <h2>Bank Details</h2>
        </div>

        <label>Account Holder</label>
        <input
          class="field"
          [(ngModel)]="bank.accountHolderName"
        />

        <label>Account Number</label>
        <input
          class="field"
          [(ngModel)]="bank.accountNumber"
        />

        <label>Confirm Account Number</label>
        <input
          class="field"
          [(ngModel)]="bank.confirmAccountNumber"
        />

        <label>IFSC</label>
        <input
          class="field"
          [(ngModel)]="bank.ifscCode"
        />

        <label>Bank Name</label>
        <input
          class="field"
          [(ngModel)]="bank.bankName"
        />

        <div class="form-actions">

          <button
            class="btn outline"
            (click)="saveBank()"
          >
            Save Bank
          </button>

          <button
            class="btn outline"
            (click)="verifyBank()"
          >
            Verify Bank
          </button>

        </div>

      </div>

      <div class="panel padded">

        <div class="section-heading">
          <h2>Payment</h2>
        </div>

        <label>Payment Mode</label>

        <select
          class="field"
          [(ngModel)]="mode"
        >
          <option>IMPS</option>
          <option>NEFT</option>
          <option>RTGS</option>
        </select>

        <div class="form-actions">

          <button
            class="btn primary"
            (click)="create()"
          >
            Create Settlement
          </button>

          @if (settlement?.settlementId) {

            <button
              class="btn primary"
              (click)="disburse()"
            >
              Disburse
            </button>

            <button
              class="btn outline"
              (click)="status()"
            >
              Payout Status
            </button>

          }

        </div>

        @if (settlement?.settlementStatus === 'PAID') {

          <a
            class="btn primary"
            routerLink="/admin/advice"
            [queryParams]="{id: id}"
          >
            Settlement Advice →
          </a>

        }

      </div>

    </div>
  `
})
export class SettlementPage implements OnInit {

  private api = inject(SettlementService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  id = 0;

  settlement: Settlement | null = null;

  mode = 'IMPS';

  bank = {
    accountHolderName: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifscCode: '',
    bankName: ''
  };

  ngOnInit() {
    this.id = Number(
      this.route.snapshot.queryParamMap.get('id')
    ) || 0;

    if (this.id) {
      this.load();
    }
  }

  load() {
    this.api.get(this.id).subscribe({
      next: r => {
        this.settlement = r;
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  saveBank() {
    this.api.bank(this.id, this.bank).subscribe({
      next: () => {
        this.message = 'Bank details saved';
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  verifyBank() {
    this.api.verifyBank(this.id).subscribe({
      next: () => {
        this.message = 'Bank verification response received';
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  create() {
    this.api.create(this.id, this.mode).subscribe({
      next: r => {
        this.settlement = r;
        this.message = 'Settlement created';
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  disburse() {
    if (!this.settlement) {
      return;
    }

    this.api.disburse(this.settlement.settlementId).subscribe({
      next: () => {
        this.message = 'Payout request processed';
        this.load();

        this.router.navigate(['/admin/advice'], {
          queryParams: {id: this.id}
        });
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  status() {
    if (!this.settlement) {
      return;
    }

    this.api.payoutStatus(this.settlement.settlementId).subscribe({
      next: r => {
        this.message = JSON.stringify(r);
        this.load();
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

}