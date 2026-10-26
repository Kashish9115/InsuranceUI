# Insurance Claim Frontend

Preserves the uploaded Insureflow visual theme. Angular standalone and lazy routes, one HTTP service per feature, no localStorage or mock data.

## Run
`npm install` then `npx ng serve --port 4300`. Backend must run on port 8080 with CORS allowing the Angular origin. Configure `src/environments/environment.ts`.

## Important backend contract checks
- Claim registration form sends `customerId`, `policyId`, `coverageId`, `claimType`, `estimatedLoss`, `incidentDate`, `description`. Confirm exact names in ClaimRequestDto.
- Backend currently exposes GET /claims (all claims). Customer-specific isolation is **not possible without authenticated identity or customer-filtered endpoint**. Do not expose this route to customers in production.
- Settlement Advice API expects `settlementId`, not `claimId`. Advice page asks for settlement ID.
- `DEMO_VERIFIED` is a backend behavior and cannot be changed by frontend labels.
- Admin status/assessment actions are still validated by backend; UI can show errors when rules are not satisfied.
