import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router, ActivatedRoute, RouterLink} from '@angular/router';
import {errorText, Claim, ClaimDocument, History, Settlement, Assessment} from '../../core/models';
import {ClaimListService} from './claim-list.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="heading">
      <div>
        <div class="eyebrow">INSURANCE / CLAIM LIST</div>
        <h1>Claim List</h1>
      </div>
    </div>

    @if (error) {
      <div class="notice">{{ error }}</div>
    }

    @if (message) {
      <div class="success">{{ message }}</div>
    }

    <div class="metrics">

      <div class="metric">
        <small>Total Claims</small>
        <strong>{{ claims.length }}</strong>
      </div>

      <div class="metric">
        <small>Registered</small>
        <strong>{{ count('REGISTERED') }}</strong>
      </div>

      <div class="metric">
        <small>Approved</small>
        <strong>{{ count('APPROVED') }}</strong>
      </div>

      <div class="metric">
        <small>Settled</small>
        <strong>{{ count('SETTLED') }}</strong>
      </div>

    </div>

    <div class="panel">

      <div class="panel-head">
        <h2>All Claims</h2>

        <input
          [(ngModel)]="search"
          placeholder="Search claims"
        />
      </div>

      <div class="table-wrap">

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer ID</th>
              <th>Policy ID</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            @for (c of filtered; track c.claimId) {

              <tr>

                <td>#{{ c.claimId }}</td>

                <td>{{ c.customerId }}</td>

                <td>{{ c.policyId }}</td>

                <td>{{ c.claimType }}</td>

                <td>
                  {{ c.estimatedLoss ?? c.claimAmount ?? c.claimedAmount | currency:'INR' }}
                </td>

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
                    [routerLink]="'/admin/documents'"
                    [queryParams]="{id: c.claimId}"
                  >
                    Documents
                  </a>

                  ·

                  <a
                    class="link"
                    [routerLink]="'/admin/assessment'"
                    [queryParams]="{id: c.claimId}"
                  >
                    Assessment
                  </a>

                  ·

                  <a
                    class="link"
                    [routerLink]="'/admin/settlement'"
                    [queryParams]="{id: c.claimId}"
                  >
                    Settlement
                  </a>

                </td>

              </tr>

            } @empty {

              <tr>
                <td colspan="7">No claims found</td>
              </tr>

            }

          </tbody>
        </table>

      </div>

    </div>
  `
})
export class ClaimListPage implements OnInit {

  private api = inject(ClaimListService);

  protected router = inject(Router);
  protected route = inject(ActivatedRoute);

  error = '';
  message = '';

  claims: Claim[] = [];
  search = '';

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

  count(s: string) {
    return this.claims.filter(
      c => (c.claimStatus || c.status) === s
    ).length;
  }

  get filtered() {
    return this.claims.filter(
      c => JSON.stringify(c)
        .toLowerCase()
        .includes(this.search.toLowerCase())
    );
  }

}