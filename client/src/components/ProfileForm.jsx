'use client';

import { useContext, useState, useEffect } from 'react';
import { Web3Context } from '../context/Provider';
import { MoveRight, Copy, AlertCircle, Check } from 'lucide-react';

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
    walletAddresses: initialData?.walletAddresses || []
  });

  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');

  // Update wallet address when account changes
  useEffect(() => {
    if (account && isConnected) {
      setFormData(prev => {
        let updatedWallets = [...prev.walletAddresses];
        
        // If no wallets exist, add the connected account
        if (updatedWallets.length === 0) {
          updatedWallets = [
            { network: 'Ethereum', address: account },
            { network: 'Sepolia', address: account },
            { network: 'Polygon', address: account }
          ];
        } else if (!initialData) {
          // Only auto-fill wallet addresses for new profiles
          // Don't override existing wallet addresses for profile edits
          updatedWallets = updatedWallets.map(wallet => ({
            ...wallet,
            address: account
          }));
        }
        
        return {
          ...prev,
          walletAddresses: updatedWallets
        };
      });
    }
  }, [account, isConnected, initialData]);

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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.username || !formData.name || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!isConnected || formData.walletAddresses.length === 0) {
      setError('You must connect your wallet to continue');
      return;
    }

    // Validate wallet addresses
    const invalidWallets = formData.walletAddresses.filter(wallet => 
      !wallet.address || !wallet.network
    );

    if (invalidWallets.length > 0) {
      setError('All wallet addresses must have both network and address');
      return;
    }

    // Standardize wallet addresses to lowercase
    const standardizedFormData = {
      ...formData,
      walletAddresses: formData.walletAddresses.map(wallet => ({
        ...wallet,
        address: wallet.address.toLowerCase()
      }))
    };
    
    try {
      await onSubmit(standardizedFormData);
    } catch (err) {
      console.error('Profile submission error:', err);
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

  // Auto-fill wallet address function
  const autoFillWalletAddress = (index) => {
    if (!account || !isConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    const updatedWallets = [...formData.walletAddresses];
    updatedWallets[index] = {
      ...updatedWallets[index],
      address: account
    };
    
    setFormData(prev => ({
      ...prev,
      walletAddresses: updatedWallets
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        {initialData ? 'Edit Your Profile' : 'Create Your Profile'}
      </h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100 flex items-start gap-2">
          <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Username*</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="your-unique-username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            disabled={!!initialData} // Cannot change username if editing
            required
          />
          <p className="text-xs text-gray-500 mt-2">This will be your profile URL: /profile/your-username</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name*</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col md:flex-row md:items-center gap-6">
            {formData.image && (
              <div className="flex-shrink-0">
                <img 
                  src={formData.image} 
                  alt="Profile Preview" 
                  className="w-28 h-28 rounded-full object-cover border-2 border-white shadow-md mx-auto md:mx-0"
                  onError={(e) => {
                    const target = e.target;
                    target.src = 'https://via.placeholder.com/150';
                  }}
                />
              </div>
            )}
            
            <div className="flex-grow space-y-3">
              <div>
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
                  className="inline-flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors cursor-pointer disabled:bg-gray-400"
                >
                  {isUploading ? 'Uploading...' : formData.image !== 'https://via.placeholder.com/150' ? 'Change Image' : 'Upload Image'}
                </label>
              </div>
              
              <p className="text-xs text-gray-500">Supported formats: JPG, PNG, GIF (max 2MB)</p>
              
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Or enter image URL manually"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell people about yourself..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows={4}
            required
          />
        </div>
        
        <div className="mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-lg font-medium text-gray-800">Wallet Addresses</label>
            {!isConnected ? (
              <button 
                type="button"
                onClick={connectWallet}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Connect Wallet <MoveRight size={16} />
              </button>
            ) : (
              <div className="text-sm bg-green-100 text-green-700 py-1 px-3 rounded-full flex items-center">
                <Check size={16} className="mr-1" />
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}
          </div>
          
          {!isConnected && (
            <div className="bg-amber-50 border border-amber-200 rounded-md p-3 mb-4 flex items-start gap-2">
              <AlertCircle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">
                You must connect your wallet to continue. Your wallet address will be automatically used for all networks.
              </p>
            </div>
          )}
          
          {isConnected && (
            <div className="space-y-3">
              {formData.walletAddresses.map((wallet, index) => (
                <div key={index} className="bg-white p-3 rounded-md border border-gray-200 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 text-blue-700 py-1 px-2 rounded text-sm font-medium">
                      {wallet.network}
                    </div>
                    <div className="font-mono text-sm text-gray-700">
                      {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)}
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => copyToClipboard(wallet.address)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                    title="Copy address"
                  >
                    <Copy size={16} />
                  </button>
                </div>
              ))}
              
              <p className="text-sm text-gray-500 italic mt-2">
                Your connected wallet address is automatically used for all networks.
              </p>
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 font-medium text-lg"
            disabled={isLoading || isUploading || !isConnected}
          >
            {isLoading ? 'Saving...' : initialData ? 'Update Profile' : 'Create Profile'}
            {!isLoading && <MoveRight size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;