import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {ClaimHistoryService} from './claim-history.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">INSURANCE / CLAIM HISTORY</div>
        <h1>Claim History</h1>
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
          class="btn primary"
          (click)="reload()"
        >
          View History
        </button>
      </div>

      <div class="timeline">

        @for (h of history; track $index) {

          <div class="event">

            <span class="dot"></span>

            <div>
              <b>{{ h.action }}</b>

              <p>
                {{ h.comments || h.remarks }} · {{formatDateTime (h.actionDate) }}
              </p>
            </div>

          </div>

        } @empty {

          <p>No history loaded.</p>

        }

      </div>

    </div>
  `
})
export class ClaimHistoryPage implements OnInit {

  private api = inject(ClaimHistoryService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  id = 0;

  history: History[] = [];

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

    this.api.getHistory(this.id).subscribe({
      next: r => {
        this.history = r ?? [];
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

  formatDateTime(dateTime?: string): string {

  if (!dateTime) {
    return '-';
  }

  const date = new Date(dateTime);

  if (isNaN(date.getTime())) {
    return dateTime;
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

}