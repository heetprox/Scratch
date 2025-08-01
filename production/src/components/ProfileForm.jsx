'use client';

import { useState } from 'react';
import { useWeb3 } from '@/context/Provider';


const ProfileForm = ({ 
  initialData, 
  onSubmit,
  isLoading = false 
}) => {
  const { account, isConnected, connect } = useWeb3();
  
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    name: initialData?.name || '',
    image: initialData?.image || 'https://via.placeholder.com/150',
    description: initialData?.description || '',
    walletAddresses: initialData?.walletAddresses || [{ network: 'Ethereum', address: account || '' }]
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWalletChange = (index, field, value) => {
    const updatedWallets = [...formData.walletAddresses];
    updatedWallets[index] = {
      ...updatedWallets[index],
      [field]: value
    };
    
    setFormData(prev => ({
      ...prev,
      walletAddresses: updatedWallets
    }));
  };

  const addWallet = () => {
    setFormData(prev => ({
      ...prev,
      walletAddresses: [...prev.walletAddresses, { network: 'Ethereum', address: '' }]
    }));
  };

  const removeWallet = (index) => {
    if (formData.walletAddresses.length <= 1) return;
    
    const updatedWallets = formData.walletAddresses.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      walletAddresses: updatedWallets
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.username || !formData.name || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (formData.walletAddresses.some(wallet => !wallet.address)) {
      setError('All wallet addresses must be filled');
      return;
    }
    
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err.message || 'Failed to save profile');
    }
  };

  const connectWallet = async () => {
    try {
      await connect();
      // Update the first wallet address with the connected account
      if (account) {
        const updatedWallets = [...formData.walletAddresses];
        if (updatedWallets.length > 0) {
          updatedWallets[0].address = account;
          setFormData(prev => ({
            ...prev,
            walletAddresses: updatedWallets
          }));
        }
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">{initialData ? 'Edit Profile' : 'Create Profile'}</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Username*</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="your-unique-username"
            className="w-full p-2 border rounded-md"
            disabled={!!initialData} // Cannot change username if editing
            required
          />
          <p className="text-xs text-gray-500 mt-1">This will be your profile URL: /profile/your-username</p>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image URL*</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="https://example.com/your-image.jpg"
            className="w-full p-2 border rounded-md"
            required
          />
          {formData.image && (
            <div className="mt-2">
              <img 
                src={formData.image} 
                alt="Profile Preview" 
                className="w-20 h-20 rounded-full object-cover"
                onError={(e) => {
                  const target = e.target;
                  target.src = 'https://via.placeholder.com/150';
                }}
              />
            </div>
          )}
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell people about yourself..."
            className="w-full p-2 border rounded-md"
            rows={4}
            required
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Wallet Addresses*</label>
            {!isConnected && (
              <button 
                type="button"
                onClick={connectWallet}
                className="text-sm bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700"
              >
                Connect Wallet
              </button>
            )}
          </div>
          
          {formData.walletAddresses.map((wallet, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={wallet.network}
                onChange={(e) => handleWalletChange(index, 'network', e.target.value)}
                className="p-2 border rounded-md w-1/3"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Sepolia">Sepolia</option>
              </select>
              <input
                type="text"
                value={wallet.address}
                onChange={(e) => handleWalletChange(index, 'address', e.target.value)}
                placeholder="0x..."
                className="p-2 border rounded-md flex-1"
              />
              <button 
                type="button" 
                onClick={() => removeWallet(index)}
                className="p-2 text-red-600 hover:text-red-800"
                disabled={formData.walletAddresses.length <= 1}
              >
                ✕
              </button>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addWallet}
            className="text-sm text-blue-600 hover:text-blue-800 mt-1"
          >
            + Add Another Wallet
          </button>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;