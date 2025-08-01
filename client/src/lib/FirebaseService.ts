import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { ScratchCard, Payment, PaymentSentEvent } from '@/types';
import { getApp } from 'firebase/app';

export class FirebaseService {
  private scratchCardsCollection;
  private paymentsCollection;
  private maxRetries = 3;
  
  constructor() {
    try {
      // Initialize collections
      this.scratchCardsCollection = collection(db, 'scratchCards');
      this.paymentsCollection = collection(db, 'payments');
      
      console.log('FirebaseService initialized successfully');
    } catch (error) {
      console.error('Error initializing FirebaseService:', error);
      // Initialize with empty collections as fallback
      this.scratchCardsCollection = collection(db, 'scratchCards');
      this.paymentsCollection = collection(db, 'payments');
    }
  }
  
  // Utility method to retry Firestore operations
  private async retryOperation<T>(operation: () => Promise<T>, errorMessage: string): Promise<T> {
    let retries = this.maxRetries;
    
    while (retries > 0) {
      try {
        return await operation();
      } catch (err: any) {
        retries--;
        if (retries === 0 || !(err.code === 'unavailable' || err.code === 'resource-exhausted' || err.code === 'deadline-exceeded')) {
          throw err; // Rethrow if not a retryable error or out of retries
        }
        console.warn(`Firestore operation failed, retrying (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait before retry
      }
    }
    
    throw new Error(`${errorMessage} after multiple attempts`);
  }

  private convertToScratchCard(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): ScratchCard {
    const data = doc.data();
    return {
      _id: doc.id,
      username: data.username || '',
      name: data.name || '',
      image: data.image || '',
      description: data.description || '',
      WalletAddress: data.WalletAddress || [],
      payments: data.payments || []
    };
  }
  
  // Prepare data for Firestore by converting Date objects to Timestamps and sanitizing data
  private prepareForFirestore<T>(data: T): T {
    if (!data) return data;
    
    try {
      // Create a deep copy to avoid modifying the original
      const result = JSON.parse(JSON.stringify(data)) as T;
      
      // Convert Date objects to Firestore Timestamps
      if (data && typeof data === 'object' && 'timestamp' in data) {
        if (data.timestamp instanceof Date) {
          (result as any).timestamp = Timestamp.fromDate(data.timestamp);
        } else if (typeof data.timestamp === 'number') {
          // Convert number timestamp (milliseconds) to Firestore Timestamp
          (result as any).timestamp = Timestamp.fromMillis(data.timestamp);
        }
      }
      
      // Sanitize the data to ensure it's Firestore compatible
      this.sanitizeForFirestore(result);
      
      return result;
    } catch (error) {
      console.error('Error preparing data for Firestore:', error);
      return data; // Return original data if conversion fails
    }
  }
  
  // Helper method to sanitize data for Firestore
  private sanitizeForFirestore(data: any): void {
    if (!data || typeof data !== 'object') return;
    
    // Remove undefined values as Firestore doesn't accept them
    Object.keys(data).forEach(key => {
      if (data[key] === undefined) {
        delete data[key];
      } else if (data[key] === null) {
        // Keep null values as Firestore accepts them
      } else if (Array.isArray(data[key])) {
        // Recursively sanitize array items
        data[key] = data[key].map(item => {
          if (typeof item === 'object' && item !== null) {
            this.sanitizeForFirestore(item);
          }
          return item;
        });
      } else if (typeof data[key] === 'object') {
        // Recursively sanitize nested objects
        this.sanitizeForFirestore(data[key]);
      }
    });
  }

  // Convert Firestore document to Payment
  private convertToPayment(doc: QueryDocumentSnapshot<DocumentData, DocumentData>): Payment {
    const data = doc.data();
    return {
      id: doc.id,
      scratchCardId: data.scratchCardId || '',
      amount: data.amount || 0,
      network: data.network || '',
      address: data.address || '',
      done: data.done || false,
      transactionHash: data.transactionHash || '',
      timestamp: data.timestamp || null
    };
  }

  // ScratchCard CRUD operations
  async createScratchCard(scratchCard: Omit<ScratchCard, '_id'>): Promise<ScratchCard> {
    try {
      // Validate input data
      if (!scratchCard || typeof scratchCard !== 'object') {
        throw new Error('Invalid scratch card data');
      }

      // Ensure required fields are present
      if (!scratchCard.username) {
        throw new Error('Username is required for scratch card');
      }

      // Log the data being sent to Firestore for debugging
      console.log('Creating scratch card with data:', JSON.stringify(scratchCard, null, 2));
      
      // Prepare data with error handling
      const preparedData = this.prepareForFirestore(scratchCard);
      
      // Ensure WalletAddress is an array
      if (!Array.isArray(preparedData.WalletAddress)) {
        preparedData.WalletAddress = [];
      }
      
      // Ensure payments is an array
      if (!Array.isArray(preparedData.payments)) {
        preparedData.payments = [];
      }
      
      // Use retry operation utility with direct error handling
      let docRef;
      try {
        docRef = await addDoc(this.scratchCardsCollection, preparedData);
      } catch (addError: any) {
        console.error('Direct addDoc error:', addError);
        // Try again with retry mechanism
        docRef = await this.retryOperation(
          () => addDoc(this.scratchCardsCollection, preparedData),
          'Failed to create scratch card'
        );
      }
      
      const newDoc = await getDoc(docRef);
      
      if (!newDoc.exists()) {
        throw new Error('Failed to create scratch card');
      }
      
      return this.convertToScratchCard(newDoc as QueryDocumentSnapshot<DocumentData, DocumentData>);
    } catch (error) {
      console.error('Error creating scratch card:', error);
      throw error;
    }
  }

  async getScratchCard(id: string): Promise<ScratchCard> {
    try {
      const docRef = doc(this.scratchCardsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error(`Scratch card with ID ${id} not found`);
      }
      
      return this.convertToScratchCard(docSnap as QueryDocumentSnapshot<DocumentData, DocumentData>);
    } catch (error) {
      console.error('Error getting scratch card:', error);
      throw error;
    }
  }

  async getScratchCardByUsername(username: string): Promise<ScratchCard> {
    try {
      const q = query(this.scratchCardsCollection, where('username', '==', username), limit(1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error(`Scratch card for username ${username} not found`);
      }
      
      return this.convertToScratchCard(querySnapshot.docs[0]);
    } catch (error) {
      console.error('Error getting scratch card by username:', error);
      throw error;
    }
  }

  async updateScratchCard(id: string, updates: Partial<ScratchCard>): Promise<ScratchCard> {
    try {
      const docRef = doc(this.scratchCardsCollection, id);
      const preparedUpdates = this.prepareForFirestore(updates) as DocumentData;
      
      await this.retryOperation(
        () => updateDoc(docRef, preparedUpdates),
        `Failed to update scratch card with ID ${id}`
      );
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error(`Scratch card with ID ${id} not found after update`);
      }
      
      return this.convertToScratchCard(updatedDoc as QueryDocumentSnapshot<DocumentData, DocumentData>);
    } catch (error) {
      console.error('Error updating scratch card:', error);
      throw error;
    }
  }
  
  async addWalletAddress(
    scratchCardId: string, 
    network: string, 
    address: string
  ): Promise<ScratchCard> {
    try {
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
    } catch (error) {
      console.error('Error adding wallet address:', error);
      throw error;
    }
  }
  
  async removeWalletAddress(scratchCardId: string, network: string): Promise<ScratchCard> {
    try {
      const scratchCard = await this.getScratchCard(scratchCardId);
      
      scratchCard.WalletAddress = scratchCard.WalletAddress.filter(
        wa => wa.network !== network
      );

      return await this.updateScratchCard(scratchCardId, {
        WalletAddress: scratchCard.WalletAddress
      });
    } catch (error) {
      console.error('Error removing wallet address:', error);
      throw error;
    }
  }

  async deleteScratchCard(id: string): Promise<void> {
    try {
      const docRef = doc(this.scratchCardsCollection, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting scratch card:', error);
      throw error;
    }
  }

  async searchScratchCards(searchTerm: string): Promise<ScratchCard[]> {
    try {
      const nameQuery = query(this.scratchCardsCollection, where('name', '>=', searchTerm), where('name', '<=', searchTerm + '\uf8ff'));
      const usernameQuery = query(this.scratchCardsCollection, where('username', '>=', searchTerm), where('username', '<=', searchTerm + '\uf8ff'));
      
      const [nameResults, usernameResults] = await Promise.all([
        getDocs(nameQuery),
        getDocs(usernameQuery)
      ]);
      
      const results = new Map<string, ScratchCard>();
      
      nameResults.forEach(doc => {
        results.set(doc.id, this.convertToScratchCard(doc));
      });
      
      usernameResults.forEach(doc => {
        results.set(doc.id, this.convertToScratchCard(doc));
      });
      
      return Array.from(results.values());
    } catch (error) {
      console.error('Error searching scratch cards:', error);
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

  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    try {
      // Prepare data with error handling
      const preparedData = this.prepareForFirestore(payment);
      
      // Use retry operation utility
      const docRef = await this.retryOperation(
        () => addDoc(this.paymentsCollection, preparedData),
        'Failed to create payment'
      );
      
      const newDoc = await getDoc(docRef);
      
      if (!newDoc.exists()) {
        throw new Error('Failed to create payment');
      }
      
      return this.convertToPayment(newDoc as QueryDocumentSnapshot<DocumentData, DocumentData>);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      const docRef = doc(this.paymentsCollection, id);
      const preparedUpdates = this.prepareForFirestore(updates) as DocumentData;
      
      await this.retryOperation(
        () => updateDoc(docRef, preparedUpdates),
        `Failed to update payment with ID ${id}`
      );
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error(`Payment with ID ${id} not found after update`);
      }
      
      return this.convertToPayment(updatedDoc as QueryDocumentSnapshot<DocumentData, DocumentData>);
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }
  
  async markPaymentComplete(paymentId: string, transactionHash: string): Promise<Payment> {
    return await this.updatePayment(paymentId, {
      done: true,
      transactionHash,
      timestamp: Date.now(),
    });
  }

  async getPaymentsByScratchCard(scratchCardId: string): Promise<Payment[]> {
    try {
      const q = query(
        this.paymentsCollection, 
        where('scratchCardId', '==', scratchCardId),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => this.convertToPayment(doc));
    } catch (error) {
      console.error('Error getting payments:', error);
      throw error;
    }
  }
  
  async getPayment(id: string): Promise<Payment | null> {
    try {
      const docRef = doc(this.paymentsCollection, id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return null;
      }
      
      return this.convertToPayment(docSnap as QueryDocumentSnapshot<DocumentData, DocumentData>);
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }
}