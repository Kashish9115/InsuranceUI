// export interface ApiResponse<T> { success?: boolean; message?: string; data: T }
// export interface Claim { claimId:number; claimNumber?:string; customerId?:number; policyId?:number; coverageId?:number; claimType?:string; estimatedLoss?:number; claimedAmount?:number; claimAmount?:number; claimStatus?:string; status?:string; claimDate?:string; description?:string; incidentDate?:string; customerName?:string; policyNumber?:string }
// export interface ClaimDocument { documentId:number; claimId?:number; documentName:string; verificationStatus:string; filePath?:string }
// export interface Assessment { assessmentId?:number; claimId?:number; assessedAmount?:number; deductible?:number; netPayable?:number; coverageId?:number }
// export interface Settlement { settlementId:number; claimId?:number; settlementStatus?:string; approvedAmount?:number; paymentMode?:string; transactionReference?:string; adviceNumber?:string }
// export interface BankDetails { accountHolderName:string; accountNumber:string; confirmAccountNumber:string; ifscCode:string; bankName:string; verificationStatus?:string }
// export interface History { historyId?:number; action?:string; actionDate?:string; performedBy?:number; comments?:string; remarks?:string }
// export function unwrap<T>(response: ApiResponse<T>|T): T { return response && typeof response==='object' && 'data' in response ? (response as ApiResponse<T>).data : response as T }
// export function errorText(error: unknown): string { const e=error as {error?:{message?:string};message?:string}; return e?.error?.message || e?.message || 'Request failed. Check backend and CORS.' }

export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
}

export interface Claim {
  claimId: number;
  claimNumber?: string;
  customerId?: number;
  policyId?: number;
  coverageId?: number;
  claimType?: string;
  estimatedLoss?: number;
  claimedAmount?: number;
  claimAmount?: number;
  claimStatus?: string;
  status?: string;
  claimDate?: string;
  description?: string;
  incidentDate?: string;
  customerName?: string;
  policyNumber?: string;
}

export interface ClaimDocument {
  documentId: number;
  claimId?: number;
  documentName: string;
  verificationStatus: string;
  filePath?: string;
}

export interface Assessment {
  assessmentId?: number;
  claimId?: number;
  assessedAmount?: number;
  deductible?: number;
  netPayable?: number;
  coverageId?: number;
}

export interface Settlement {
  settlementId: number;
  claimId?: number;
  settlementStatus?: string;
  approvedAmount?: number;
  paymentMode?: string;
  transactionReference?: string;
  adviceNumber?: string;
}

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  confirmAccountNumber: string;
  ifscCode: string;
  bankName: string;
  verificationStatus?: string;
}

export interface History {
  historyId?: number;
  action?: string;
  actionDate?: string;
  performedBy?: number;
  comments?: string;
  remarks?: string;
}

export function unwrap<T>(response: ApiResponse<T> | T): T {
  return response && typeof response === 'object' && 'data' in response
    ? (response as ApiResponse<T>).data
    : response as T;
}

export function errorText(error: unknown): string {
  const e = error as {
    error?: {
      message?: string;
    };
    message?: string;
  };

  return e?.error?.message || e?.message || 'Request failed. Check backend and CORS.';
}