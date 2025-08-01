import { ScratchCard, Payment, PaymentSentEvent } from '@/types';
import { FirebaseService } from './FirebaseService';

export class UserService {
  private baseUrl: string;
  private firebaseService: FirebaseService;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
    this.firebaseService = new FirebaseService();
  }

  async createScratchCard(scratchCard: Omit<ScratchCard, '_id'>): Promise<ScratchCard> {
    try {
      return await this.firebaseService.createScratchCard(scratchCard);
    } catch (error) {
      console.error('Error creating scratch card:', error);
      throw error;
    }
  }

  async getScratchCard(id: string): Promise<ScratchCard> {
    try {
      return await this.firebaseService.getScratchCard(id);
    } catch (error) {
      console.error('Error getting scratch card:', error);
      throw error;
    }
  }

  async getScratchCardByUsername(username: string): Promise<ScratchCard> {
    try {
      return await this.firebaseService.getScratchCardByUsername(username);
    } catch (error) {
      console.error('Error getting scratch card by username:', error);
      throw error;
    }
  }

  async updateScratchCard(id: string, updates: Partial<ScratchCard>): Promise<ScratchCard> {
    try {
      return await this.firebaseService.updateScratchCard(id, updates);
    } catch (error) {
      console.error('Error updating scratch card:', error);
      throw error;
    }
  }

  async deleteScratchCard(id: string): Promise<void> {
    try {
      await this.firebaseService.deleteScratchCard(id);
    } catch (error) {
      console.error('Error deleting scratch card:', error);
      throw error;
    }
  }

  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    try {
      return await this.firebaseService.createPayment(payment);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      return await this.firebaseService.updatePayment(id, updates);
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  async getPaymentsByScratchCard(scratchCardId: string): Promise<Payment[]> {
    try {
      return await this.firebaseService.getPaymentsByScratchCard(scratchCardId);
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  }

  async recordBlockchainPayment(paymentEvent: PaymentSentEvent, scratchCardId: string): Promise<Payment> {
    const payment: Omit<Payment, 'id'> = {
      scratchCardId,
      amount: Number(paymentEvent.amount) / 1e18,
      network: 'ethereum',
      address: paymentEvent.recipient,
      done: true,
      transactionHash: paymentEvent.transactionHash,
      timestamp: Number(paymentEvent.timestamp) * 1000, 
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

  async addWalletAddress(
    scratchCardId: string, 
    network: string, 
    address: string
  ): Promise<ScratchCard> {
    const scratchCard = await this.getScratchCard(scratchCardId);
    
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

  async searchScratchCards(query: string): Promise<ScratchCard[]> {
    try {
      return await this.firebaseService.searchScratchCards(query);
    } catch (error) {
      console.error('Error searching scratch cards:', error);
      throw error;
    }
  }

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