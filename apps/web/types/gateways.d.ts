export {};

declare global {
  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }

  type RazorpayPaymentResponse = RazorpayResponse;

  interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    theme?: {
      color?: string;
    };
    handler?: (response: RazorpayResponse) => void;
    modal?: {
      ondismiss?: () => void;
    };
  }

  interface Window {
    Razorpay?: new (options: RazorpayOptions) => {
      open: () => void;
    };
    Cashfree?: (options: { mode: 'production' | 'sandbox' }) => {
      checkout: (options: {
        paymentSessionId: string;
        redirectTarget?: '_modal' | '_self' | '_blank';
      }) => Promise<{
        error?: { message: string; code: string };
        redirect?: boolean;
        paymentDetails?: { paymentMessage: string };
      }>;
    };
  }
}
