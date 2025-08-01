import { UserData } from '@/types';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export class UserService {
  private static readonly COLLECTION = 'users';

  static async getUserByWallet(walletAddress: string): Promise<UserData | null> {
    try {
      const userDoc = await getDoc(doc(db, this.COLLECTION, walletAddress.toLowerCase()));
      
      if (userDoc.exists()) {
        return userDoc.data() as UserData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw new Error('Failed to fetch user data');
    }
  }

  static async createUser(userData: Partial<UserData>): Promise<UserData> {
    try {
      if (!userData.walletAddress) {
        throw new Error('Wallet address is required');
      }

      const newUser: UserData = {
        walletAddress: userData.walletAddress.toLowerCase(),
        username: userData.username || '',
        email: userData.email || '',
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
        isActive: true,
      };

      await setDoc(doc(db, this.COLLECTION, newUser.walletAddress), newUser);
      return newUser;
    } catch (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
  }

  static async updateUser(walletAddress: string, updates: Partial<UserData>): Promise<void> {
    try {
      const userRef = doc(db, this.COLLECTION, walletAddress.toLowerCase());
      await updateDoc(userRef, {
        ...updates,
        lastLogin: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user');
    }
  }

  static async getOrCreateUser(walletAddress: string): Promise<UserData> {
    let user = await this.getUserByWallet(walletAddress);
    
    if (!user) {
      user = await this.createUser({ walletAddress });
    } else {
      // Update last login
      await this.updateUser(walletAddress, {});
    }
    
    return user;
  }
}