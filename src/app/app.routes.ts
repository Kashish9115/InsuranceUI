import {Routes} from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'admin/claims'
  },

  {
    path: 'admin/claims',
    loadComponent: () =>
      import('./features/claim-list/claim-list.page')
        .then(m => m.ClaimListPage)
  },

  {
    path: 'admin/documents',
    loadComponent: () =>
      import('./features/document-review/document-review.page')
        .then(m => m.DocumentReviewPage)
  },

  {
    path: 'admin/assessment',
    loadComponent: () =>
      import('./features/assessment/assessment.page')
        .then(m => m.AssessmentPage)
  },

  {
    path: 'admin/settlement',
    loadComponent: () =>
      import('./features/settlement/settlement.page')
        .then(m => m.SettlementPage)
  },

  ...['customer', 'agent'].flatMap(role => [

    {
      path: `${role}/raise-claim`,
      loadComponent: () =>
        import('./features/claim-registration/claim-registration.page')
          .then(m => m.ClaimRegistrationPage)
    },

    {
      path: `${role}/claim-status`,
      loadComponent: () =>
        import('./features/claim-status/claim-status.page')
          .then(m => m.ClaimStatusPage)
    },

    {
      path: `${role}/claim-history`,
      loadComponent: () =>
        import('./features/claim-history/claim-history.page')
          .then(m => m.ClaimHistoryPage)
    },

    {
      path: `${role}/documents`,
      loadComponent: () =>
        import('./features/claim-documents/claim-documents.page')
          .then(m => m.ClaimDocumentsPage)
    }

  ]),

  ...['admin', 'agent', 'customer'].map(role => ({

    path: `${role}/advice`,

    loadComponent: () =>
      import('./features/settlement-advice/settlement-advice.page')
        .then(m => m.SettlementAdvicePage)

  })),

  {
    path: '**',
    redirectTo: 'admin/claims'
  }

];