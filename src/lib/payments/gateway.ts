export interface PaymentInitParams {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
}

export interface PaymentInitResult {
  success: boolean;
  paymentReference: string;
  checkoutUrl?: string;
  providerPaymentId?: string;
  error?: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  orderId?: string;
  paymentReference?: string;
  status: 'pending' | 'paid' | 'failed' | 'expired';
  rawPayload: Record<string, unknown>;
  errorMessage?: string;
}

export interface PaymentGateway {
  name: string;
  createInvoice(params: PaymentInitParams): Promise<PaymentInitResult>;
  verifyWebhook(headers: Headers, bodyText: string): Promise<WebhookVerificationResult>;
}
