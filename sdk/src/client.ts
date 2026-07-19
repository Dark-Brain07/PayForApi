import { x402Client, x402HTTPClient } from '@x402/core/client';
import { registerExactEvmScheme } from '@x402/evm/exact/client';
import { privateKeyToAccount } from 'viem/accounts';

/**
 * Constructs a full URL from a base path and endpoint.
 */
export const constructUrl = (base: string, endpoint: string): string => `${base.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;

const HTTP_STATUS_PAYMENT_REQUIRED = 402;

export interface PayForApiClientOptions {
  privateKey: string;
  rpcUrl?: string; // e.g. https://alfajores-forno.celo-testnet.org
}

export class PayForApiClient {
  private x402HttpClient: x402HTTPClient;

  constructor(options: PayForApiClientOptions) {
    const account = privateKeyToAccount(options.privateKey as `0x${string}`);
    
    // Initialize core client
    let coreClient = new x402Client();
    
    // Register EVM scheme
    coreClient = registerExactEvmScheme(coreClient, {
      signer: account,
      schemeOptions: {
        rpcUrl: options.rpcUrl || 'https://alfajores-forno.celo-testnet.org'
      }
    });

    // Wrap with HTTP client for fetch functionality
    this.x402HttpClient = new x402HTTPClient(coreClient);
  }

  /**
   * Fetches data from a Pay For API x402 endpoint.
   * If a 402 Payment Required is returned, it automatically signs and pays
   * using the agent's configured Celo wallet, then retries the request.
   */
  public async fetch(url: string, init?: RequestInit): Promise<Response> {
    try {
      // Execute the request via the x402 HTTP client wrapper
      // It handles the interception of the 402, paying the invoice, and retrying
      // We will perform the first fetch, if it's 402, x402HttpClient handles payment.
      
      let response = await fetch(url, init);
      if (response.status === HTTP_STATUS_PAYMENT_REQUIRED) {
         
         const authHeader = response.headers.get('WWW-Authenticate');
         if (!authHeader) {
           throw new Error('Missing WWW-Authenticate header in 402 response');
         }

         const paymentRequired = this.x402HttpClient.getPaymentRequiredResponse((name: string) => response.headers.get(name));
         
         // Create payment payload
         const paymentPayload = this.x402HttpClient.createPaymentPayload(paymentRequired);
         
         // Encode payment header
         const headers = new Headers(init?.headers);
         const signatureHeaders = this.x402HttpClient.encodePaymentSignatureHeader(paymentPayload);
         for (const [key, value] of Object.entries(signatureHeaders)) {
           headers.set(key, String(value));
         }

         // Retry fetch
         response = await fetch(url, {
           ...init,
           headers
         });
         
         // Process result
         this.x402HttpClient.processPaymentResult(paymentPayload, (name: string) => response.headers.get(name), response.status);
      }
      
      return response;
    } catch (error: unknown) {
      console.warn('[PayForApiClient] Error fetching data:', error);
      throw error;
    }
  }
}
