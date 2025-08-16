import { useState, useEffect, useContext } from 'react';
import { Copy, AlertCircle, User, Camera, FileText, CheckCircle, CircleQuestionMark, Mail } from 'lucide-react';
import Button from './ui/Button';
import Profile1 from './placeholder/Profile1';
import { Web3Context } from '@/context/Provider';

const ProfileWizard = ({
  initialData,
  onSubmit,
  isLoading = false
}) => {

  const { isConnected, account } = useContext(Web3Context)

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    username: initialData?.username || '',
    email: initialData?.email || '',
    name: initialData?.name || initialData?.username || '',
    image: initialData?.image || '/user.png',
    description: initialData?.description || '',
    walletAddresses: initialData?.walletAddresses || []
  });

  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');

  const steps = [
    { id: 1, title: 'Set Username', icon: User },
    { id: 2, title: 'Profile Image', icon: Camera },
    { id: 3, title: 'Email Address', icon: Mail },
    { id: 4, title: 'Review & Create', icon: CheckCircle }
  ];

  // Update wallet address when account changes
  useEffect(() => {
    if (account && isConnected) {
      setFormData(prev => {
        let updatedWallets = [...prev.walletAddresses];

        if (updatedWallets.length === 0) {
          updatedWallets = [
            { network: 'Ethereum', address: account },
            { network: 'Sepolia', address: account },
            { network: 'Polygon', address: account }
          ];
        } else if (!initialData) {
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

  // Auto-sync username with name
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      name: prev.username
    }));
  }, [formData.username]);

  // Cleanup object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (formData.image && formData.image.startsWith('blob:')) {
        URL.revokeObjectURL(formData.image);
      }
    };
  }, [formData.image]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStep = (step) => {
    setError('');

    switch (step) {
      case 1:
        if (!formData.username.trim()) {
          setError('Username is required');
          return false;
        }
        break;
      case 2:
        // Image is optional, always valid
        break;
      case 3:
        if (!formData.email.trim()) {
          setError('Email address is required');
          return false;
        }
        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(''), 2000);
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(3)) return;

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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    if (file.size > 2000000) {
      setError('Image size must be less than 2MB');
      return;
    }

    setIsUploading(true);
    setError('');

    try {
      const imageUrl = URL.createObjectURL(file);
      
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
      
      setIsUploading(false);
    } catch (err) {
      setError('Failed to upload image');
      setIsUploading(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center min-h-screen flex flex-col justify-between items-center w-full h-full">
            <div className=""></div>
            <div className="flex flex-col max-w-xl justify-center items-start p-2 gap-1 h-full w-full">
              <div className="text-black font-medium text-xl">pick a username</div>
              <div className="gap-3 flex w-full">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="username"
                  className="w-full p-2 px-4 border-2 border-black placeholder:text-black/50 rounded-lg focus:ring-2 focus:ring-black focus:bg-[#2e2e2e]/5 focus:border-black transition-colors text-2xl ber text-left"
                  disabled={!!initialData}
                  required
                />
                <div className="flex cursor-pointer justify-center rounded-lg items-center w-20 h-20 aspect-square bg-black">
                  <User color="white" />
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
            <div className="flex w-full border-t p-4 border-black justify-end">
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.username.trim()}
                className=""
              >
                <Button text="next" color="black" textColor="white" />
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="w-full min-h-screen h-full flex flex-col justify-between items-center">
            <div className=""></div>
            <div className="w-[90vw] md:w-[40vw]">
              <Profile1 Name={formData.username} image={formData.image} address={account} />
            </div>

            <div className="max-w-md mx-auto">
              <div className="space-y-4">
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
                    className="text-white bg-black w-fit py-5 cursor-pointer px-8 translate-y-6 rounded-lg transition-colors font-medium text-lg"
                  >
                    {isUploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
            <div className=""></div>

            <div className="flex w-full border-t p-4 border-black justify-end">
             
              <button
                type="button"
                onClick={nextStep}
                className=""
              >
                <Button text="next" color="black" textColor="white" />
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="text-center min-h-screen flex flex-col justify-between items-center w-full h-full">
            <div className=""></div>
            <div className="flex flex-col max-w-xl justify-center items-start p-2 gap-1 h-full w-full">
              <div className="text-black font-medium text-xl">enter your email</div>
              <div className="gap-3 flex w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="w-full p-4 border-2 border-black placeholder:text-black/50 rounded-lg focus:ring-2 focus:ring-black focus:bg-[#2e2e2e]/5 focus:border-black transition-colors text-xl ber text-left "
                  required
                />
                <div className="flex justify-center rounded-lg items-center w-20 h-20 aspect-square bg-black">
                  <Mail color="white" />
                </div>
              </div>
              {error && (
                <div className="text-red-500 text-sm mt-2 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
            <div className="flex w-full border-t p-4 border-black justify-end">
              
              <button
                type="button"
                onClick={nextStep}
                disabled={!formData.email.trim() || !validateEmail(formData.email)}
                className=""
              >
                <Button text="next" color="black" textColor="white" />
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={48} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Review Your Profile</h2>
              <p className="text-gray-600 text-lg mb-8">
                Check everything looks good before creating your profile
              </p>
            </div>

            <div className="max-w-md mx-auto bg-gray-50 rounded-2xl p-8 space-y-6">
              {/* Profile Preview */}
              <div className="text-center">
                <img
                  src={formData.image}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-md"
                />
                <h3 className="text-xl font-bold text-gray-800">{formData.name || formData.username}</h3>
                <p className="text-blue-600 font-medium">@{formData.username}</p>
                <p className="text-gray-600 text-sm mt-1">{formData.email}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-700 mb-3">Connected Wallets</h4>
                <div className="space-y-2">
                  {formData.walletAddresses.map((wallet, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded text-xs font-medium">
                          {wallet.network}
                        </span>
                        <span className="font-mono text-sm text-gray-700">
                          {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(wallet.address)}
                        className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
            
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen h-full flex flex-col justify-center items-center">
      <div className="h-full w-full flex flex-col justify-center">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default ProfileWizard;