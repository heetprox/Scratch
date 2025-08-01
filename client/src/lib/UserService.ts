import { ScratchCard, Payment, PaymentSentEvent } from '@/types';

export class UserService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async createScratchCard(scratchCard: Omit<ScratchCard, '_id'>): Promise<ScratchCard> {
    try {
      const response = await fetch(`${this.baseUrl}/scratchcards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scratchCard),
      });

      if (!response.ok) {
        throw new Error(`Failed to create scratch card: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating scratch card:', error);
      throw error;
    }
  }

  async getScratchCard(id: string): Promise<ScratchCard> {
    try {
      const response = await fetch(`${this.baseUrl}/scratchcards/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get scratch card: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting scratch card:', error);
      throw error;
    }
  }

  async getScratchCardByUsername(username: string): Promise<ScratchCard> {
    try {
      const response = await fetch(`${this.baseUrl}/scratchcards/username/${username}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get scratch card: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting scratch card by username:', error);
      throw error;
    }
  }

  async updateScratchCard(id: string, updates: Partial<ScratchCard>): Promise<ScratchCard> {
    try {
      const response = await fetch(`${this.baseUrl}/scratchcards/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update scratch card: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating scratch card:', error);
      throw error;
    }
  }

  async deleteScratchCard(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/scratchcards/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete scratch card: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting scratch card:', error);
      throw error;
    }
  }

  // Payment operations
  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payment),
      });

      if (!response.ok) {
        throw new Error(`Failed to create payment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update payment: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async getPaymentsByScratchCard(scratchCardId: string): Promise<Payment[]> {
    try {
      const response = await fetch(`${this.baseUrl}/payments/scratchcard/${scratchCardId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to get payments: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  }

  // Blockchain integration methods
  async recordBlockchainPayment(paymentEvent: PaymentSentEvent, scratchCardId: string): Promise<Payment> {
    const payment: Omit<Payment, 'id'> = {
      scratchCardId,
      amount: Number(paymentEvent.amount) / 1e18, // Convert from wei to ETH
      network: 'ethereum', // You can determine this from chainId
      address: paymentEvent.recipient,
      done: true,
      transactionHash: paymentEvent.transactionHash,
      timestamp: Number(paymentEvent.timestamp) * 1000, // Convert to milliseconds
    };

    return await this.createPayment(payment);
  }

  async markPaymentComplete(paymentId: string, transactionHash: string): Promise<Payment> {
    return await this.updatePayment(paymentId, {
      done: true,
      transactionHash,
      timestamp: Date.now(),
    });
  }

  // Wallet address management
  async addWalletAddress(
    scratchCardId: string, 
    network: string, 
    address: string
  ): Promise<ScratchCard> {
    const scratchCard = await this.getScratchCard(scratchCardId);
    
    // Check if address already exists for this network
    const existingAddress = scratchCard.WalletAddress.find(wa => wa.network === network);
    
    if (existingAddress) {
      existingAddress.address = address;
    } else {
      scratchCard.WalletAddress.push({ network, address });
    }

    return await this.updateScratchCard(scratchCardId, {
      WalletAddress: scratchCard.WalletAddress
    });
  }

  async removeWalletAddress(scratchCardId: string, network: string): Promise<ScratchCard> {
    const scratchCard = await this.getScratchCard(scratchCardId);
    
    scratchCard.WalletAddress = scratchCard.WalletAddress.filter(
      wa => wa.network !== network
    );

    return await this.updateScratchCard(scratchCardId, {
      WalletAddress: scratchCard.WalletAddress
    });
  }

  // Search and filtering
  async searchScratchCards(query: string): Promise<ScratchCard[]> {
    try {
      const response = await fetch(`${this.baseUrl}/scratchcards/search?q=${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to search scratch cards: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error searching scratch cards:', error);
      throw error;
    }
  }

  // Validation helpers
  validateEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  validateAmount(amount: string): boolean {
    try {
      const num = parseFloat(amount);
      return num > 0 && !isNaN(num) && isFinite(num);
    } catch {
      return false;
    }
  }

  formatEthAmount(amount: number | string): string {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return num.toFixed(6).replace(/\.?0+$/, '');
  }

  // Network helpers
  getNetworkName(chainId: number): string {
    switch (chainId) {
      case 1:
        return 'ethereum';
      case 11155111:
        return 'sepolia';
      default:
        return 'unknown';
    }
  }

  // Error handling helper
  handleApiError(error: any): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'string') {
      return error;
    }
    
    return 'An unexpected error occurred';
  }
}