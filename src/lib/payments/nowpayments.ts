import crypto from "crypto";
import { PaymentGateway, PaymentInitParams, PaymentInitResult, WebhookVerificationResult } from "./gateway";

export class NOWPaymentsGateway implements PaymentGateway {
  public name = "nowpayments";
  private apiKey: string;
  private ipnSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.NOWPAYMENTS_API_KEY || "";
    this.ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET || "";
    const isSandbox = process.env.NOWPAYMENTS_SANDBOX === "true";
    this.baseUrl = isSandbox
      ? "https://api-sandbox.nowpayments.io/v1"
      : "https://api.nowpayments.io/v1";
  }

  async createInvoice(params: PaymentInitParams): Promise<PaymentInitResult> {
    if (!this.apiKey) {
      // Return a simulated reference when API key is not yet configured so development / demo checkout can succeed safely
      const mockRef = `NP_SIM_${Date.now()}_${params.orderNumber}`;
      return {
        success: true,
        paymentReference: mockRef,
        providerPaymentId: `SIM-${Date.now()}`,
        checkoutUrl: `${params.successUrl}?simulated=true&ref=${mockRef}`,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/invoice`, {
        method: "POST",
        headers: {
          "x-api-key": this.apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price_amount: params.amount,
          price_currency: "ngn",
          order_id: params.orderId,
          order_description: `JETTEA Order #${params.orderNumber}`,
          ipn_callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/webhooks/nowpayments`,
          success_url: params.successUrl,
          cancel_url: params.cancelUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          paymentReference: `NP-ERR-${Date.now()}`,
          error: data.message || "Failed to create NOWPayments invoice",
        };
      }

      return {
        success: true,
        paymentReference: data.id?.toString() || data.order_id,
        checkoutUrl: data.invoice_url,
        providerPaymentId: data.id?.toString(),
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Network error contacting NOWPayments";
      return {
        success: false,
        paymentReference: `NP-ERR-${Date.now()}`,
        error: errorMsg,
      };
    }
  }

  async verifyWebhook(headers: Headers, bodyText: string): Promise<WebhookVerificationResult> {
    try {
      const signatureHeader = headers.get("x-nowpayments-sig");
      const parsedBody = JSON.parse(bodyText);

      if (this.ipnSecret && signatureHeader) {
        // Sort keys and compute HMAC-SHA512
        const sortedKeys = Object.keys(parsedBody).sort();
        const sortedObj: Record<string, unknown> = {};
        for (const key of sortedKeys) {
          sortedObj[key] = parsedBody[key];
        }
        const hmac = crypto
          .createHmac("sha512", this.ipnSecret)
          .update(JSON.stringify(sortedObj))
          .digest("hex");

        if (hmac !== signatureHeader) {
          return {
            isValid: false,
            status: "failed",
            rawPayload: parsedBody,
            errorMessage: "Invalid HMAC signature header",
          };
        }
      }

      const paymentStatus = parsedBody.payment_status;
      let mappedStatus: 'pending' | 'paid' | 'failed' | 'expired' = 'pending';

      if (paymentStatus === 'finished' || paymentStatus === 'confirmed' || paymentStatus === 'sending') {
        mappedStatus = 'paid';
      } else if (paymentStatus === 'failed') {
        mappedStatus = 'failed';
      } else if (paymentStatus === 'expired') {
        mappedStatus = 'expired';
      }

      return {
        isValid: true,
        orderId: parsedBody.order_id,
        paymentReference: parsedBody.payment_id?.toString() || parsedBody.invoice_id?.toString(),
        status: mappedStatus,
        rawPayload: parsedBody,
      };
    } catch (err: unknown) {
      return {
        isValid: false,
        status: "failed",
        rawPayload: {},
        errorMessage: err instanceof Error ? err.message : "Error parsing webhook payload",
      };
    }
  }
}

export const nowPaymentsGateway = new NOWPaymentsGateway();
