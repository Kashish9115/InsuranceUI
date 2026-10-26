import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {ClaimStatusService} from './claim-status.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">INSURANCE / CLAIM STATUS</div>
        <h1>Claim Status</h1>
      </div>
    </div>

    @if (error) {
      <div class="notice">{{ error }}</div>
    }

    @if (message) {
      <div class="success">{{ message }}</div>
    }

    <div class="panel">

      <div class="panel-head">
        <h2>Claim Status</h2>

        <button
          class="btn outline"
          (click)="reload()"
        >
          Refresh
        </button>
      </div>

      <div class="table-wrap">

        <table>
          <thead>
            <tr>
              <th>Claim</th>
              <th>Type</th>
              <th>Status</th>
              <th>Documents</th>
              <th>History</th>
              <th>Advice</th>
            </tr>
          </thead>

          <tbody>

            @for (c of claims; track c.claimId) {

              <tr>

                <td>#{{ c.claimId }}</td>

                <td>{{ c.claimType }}</td>

                <td>
                  <span
                    class="badge"
                    [attr.data-status]="c.claimStatus || c.status"
                  >
                    {{ c.claimStatus || c.status }}
                  </span>
                </td>

                <td>
                  <a
                    class="link"
                    [routerLink]="'/' + role + '/documents'"
                    [queryParams]="{id: c.claimId}"
                  >
                    View →
                  </a>
                </td>

                <td>
                  <a
                    class="link"
                    [routerLink]="'/' + role + '/claim-history'"
                    [queryParams]="{id: c.claimId}"
                  >
                    History →
                  </a>
                </td>

                <td>
                  @if ((c.claimStatus || c.status) === 'SETTLED') {
                    <a
                      class="link"
                      [routerLink]="'/' + role + '/advice'"
                      [queryParams]="{id: c.claimId}"
                    >
                      Advice →
                    </a>
                  }
                </td>

              </tr>

            } @empty {

              <tr>
                <td colspan="6">
                  No claims returned by backend.
                </td>
              </tr>

            }

          </tbody>
        </table>

      </div>

    </div>
  `
})
export class ClaimStatusPage implements OnInit {

  private api = inject(ClaimStatusService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  claims: Claim[] = [];

  get role() {
    return this.router.url.split('/')[1];
  }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.api.getAll().subscribe({
      next: r => {
        this.claims = r ?? [];
      },
      error: e => {
        this.error = errorText(e);
      }
    });
  }

}