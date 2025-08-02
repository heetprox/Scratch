'use client';

import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../context/Provider';

const ProfileForm = ({ 
  initialData, 
  onSubmit,
  isLoading = false 
}) => {
  const { account, isConnected, connect } = useContext(Web3Context);
  
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    name: initialData?.name || '',
    image: initialData?.image || 'https://via.placeholder.com/150',
    description: initialData?.description || '',
    walletAddresses: initialData?.walletAddresses || [{ network: 'Ethereum', address: '' }]
  });

  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Update wallet address when account changes
  useEffect(() => {
    if (account && isConnected) {
      setFormData(prev => {
        const updatedWallets = [...prev.walletAddresses];
        // Update the first wallet address with the connected account
        if (updatedWallets.length > 0 && !updatedWallets[0].address) {
          updatedWallets[0].address = account;
        }
        return {
          ...prev,
          walletAddresses: updatedWallets
        };
      });
    }
  }, [account, isConnected]);

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
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  // Handle file upload to Cloudinary using your lib
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2000000) {
      setError('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      // Use your API route for upload
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        image: data.secure_url || data.url
      }));
    } catch (err) {
      console.error('Upload error:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
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
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image*</label>
          
          <div className="flex items-center space-x-4">
            {formData.image && (
              <div className="flex-shrink-0">
                <img 
                  src={formData.image} 
                  alt="Profile Preview" 
                  className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => {
                    const target = e.target;
                    target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
            )}
            
            <div className="flex-grow">
              <div className="mb-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading}
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400"
                >
                  {isUploading ? 'Uploading...' : formData.image !== 'https://via.placeholder.com/150' ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
              
              <p className="text-xs text-gray-500 mb-2">Supported formats: JPG, PNG, GIF (max 2MB)</p>
              
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Or enter image URL manually"
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell people about yourself..."
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                className="text-sm bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Connect Wallet
              </button>
            )}
            {isConnected && account && (
              <div className="text-sm text-green-600 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
          
          {formData.walletAddresses.map((wallet, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <select
                value={wallet.network}
                onChange={(e) => handleWalletChange(index, 'network', e.target.value)}
                className="p-2 border rounded-md w-1/3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Ethereum">Ethereum</option>
                <option value="Sepolia">Sepolia</option>
              </select>
              <input
                type="text"
                value={wallet.address}
                onChange={(e) => handleWalletChange(index, 'address', e.target.value)}
                placeholder="0x..."
                className="p-2 border rounded-md flex-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
              />
              <button 
                type="button" 
                onClick={() => removeWallet(index)}
                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                disabled={formData.walletAddresses.length <= 1}
                title="Remove wallet address"
              >
                ✕
              </button>
            </div>
          ))}
          
          <button 
            type="button" 
            onClick={addWallet}
            className="text-sm text-blue-600 hover:text-blue-800 mt-1 transition-colors"
          >
            + Add Another Wallet
          </button>  
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            disabled={isLoading || isUploading}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;