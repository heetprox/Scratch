import { db } from './firebase';
import { collection, doc, getDoc, getDocs, addDoc, updateDoc, deleteDoc, query, where, orderBy, limit, DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase/firestore';
import { ScratchCard, Payment, PaymentSentEvent } from '@/types';

export class FirebaseService {
  private scratchCardsCollection = collection(db, 'scratchCards');
  private paymentsCollection = collection(db, 'payments');

  // Convert Firestore document to ScratchCard
  private convertToScratchCard(doc: QueryDocumentSnapshot<DocumentData>): ScratchCard {
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
  
  // Prepare data for Firestore by converting Date objects to Timestamps
  private prepareForFirestore(data: any) {
    const result = { ...data };
    
    // Convert Date objects to Firestore Timestamps
    if (data.timestamp instanceof Date) {
      result.timestamp = Timestamp.fromDate(data.timestamp);
    }
    
    return result;
  }

  // Convert Firestore document to Payment
  private convertToPayment(doc: QueryDocumentSnapshot<DocumentData>): Payment {
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
      const docRef = await addDoc(this.scratchCardsCollection, this.prepareForFirestore(scratchCard));
      const newDoc = await getDoc(docRef);
      
      if (!newDoc.exists()) {
        throw new Error('Failed to create scratch card');
      }
      
      return this.convertToScratchCard(newDoc as QueryDocumentSnapshot<DocumentData>);
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
      
      return this.convertToScratchCard(docSnap as QueryDocumentSnapshot<DocumentData>);
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
      await updateDoc(docRef, this.prepareForFirestore(updates) as DocumentData);
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error(`Scratch card with ID ${id} not found after update`);
      }
      
      return this.convertToScratchCard(updatedDoc as QueryDocumentSnapshot<DocumentData>);
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

  async searchScratchCards(query: string): Promise<ScratchCard[]> {
    try {
      // Firebase doesn't support text search natively, so we'll do a simple query
      // In a production app, you might want to use Algolia or another search service
      const nameQuery = query(this.scratchCardsCollection, where('name', '>=', query), where('name', '<=', query + '\uf8ff'));
      const usernameQuery = query(this.scratchCardsCollection, where('username', '>=', query), where('username', '<=', query + '\uf8ff'));
      
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
  
  // Method to handle blockchain payment events
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

  // Payment CRUD operations
  async createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
    try {
      const docRef = await addDoc(this.paymentsCollection, this.prepareForFirestore(payment));
      const newDoc = await getDoc(docRef);
      
      if (!newDoc.exists()) {
        throw new Error('Failed to create payment');
      }
      
      return this.convertToPayment(newDoc as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  }

  async updatePayment(id: string, updates: Partial<Payment>): Promise<Payment> {
    try {
      const docRef = doc(this.paymentsCollection, id);
      await updateDoc(docRef, this.prepareForFirestore(updates) as DocumentData);
      
      const updatedDoc = await getDoc(docRef);
      if (!updatedDoc.exists()) {
        throw new Error(`Payment with ID ${id} not found after update`);
      }
      
      return this.convertToPayment(updatedDoc as QueryDocumentSnapshot<DocumentData>);
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
      
      return this.convertToPayment(docSnap as QueryDocumentSnapshot<DocumentData>);
    } catch (error) {
      console.error('Error getting payment:', error);
      throw error;
    }
  }
}