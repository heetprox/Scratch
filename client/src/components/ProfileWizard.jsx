import { useState, useEffect, useContext } from 'react';
import { Copy, AlertCircle, User, Camera, FileText, CheckCircle, CircleQuestionMark, Mail } from 'lucide-react';
import Button from './ui/Button';
import Profile1 from './placeholder/Profile1';
import { Web3Context } from '@/context/Provider';
import Image from 'next/image';

const socials =[
  {
    title: 'Twitter',
    icon: '/icons/ixx.svg',
  },
  {
    title: 'Instagram',
    icon: '/icons/iinsta.svg',
  },
  {
    title: 'Spotify',
    icon: '/icons/ispotify.svg',
  },
  {
    title: 'TikTok',
    icon: '/icons/itik.svg',

  },
  {
    title: 'Github',
    icon: '/icons/igit.svg',
  }
]

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
    image: initialData?.image || '/user.svg',
    description: initialData?.description || '',
    walletAddresses: initialData?.walletAddresses || []
  });

  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Store the actual file for upload
  const [previewImage, setPreviewImage] = useState(formData.image); // Store preview URL

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
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }
    };
  }, [previewImage]);

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

  // Function to upload image to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(3)) return;

    setIsUploading(true);
    setError('');

    try {
      let imageUrl = formData.image;

      // Upload image if a new file was selected
      if (selectedFile) {
        imageUrl = await uploadImageToCloudinary(selectedFile);
      }

      const standardizedFormData = {
        ...formData,
        image: imageUrl,
        walletAddresses: formData.walletAddresses.map(wallet => ({
          ...wallet,
          address: wallet.address.toLowerCase()
        }))
      };

      await onSubmit(standardizedFormData);
    } catch (err) {
      console.error('Profile submission error:', err);
      setError(err.message || 'Failed to save profile');
    } finally {
      setIsUploading(false);
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

    setError('');

    try {
      // Clean up previous preview URL
      if (previewImage && previewImage.startsWith('blob:')) {
        URL.revokeObjectURL(previewImage);
      }

      // Create preview URL and store file for later upload
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setSelectedFile(file);
      
      // Update formData for immediate UI feedback
      setFormData(prev => ({
        ...prev,
        image: imageUrl
      }));
      
    } catch (err) {
      setError('Failed to process image');
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
              <Profile1 Name={formData.username} image={previewImage} address={account} />
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
                    {selectedFile ? 'Change Image' : 'Upload Image'}
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
            <div className="text-4xl font-bold text-black">you are all set</div>

            <div className="max-w-md mx-auto bg-white shadow-xl border border-black rounded-4xl overflow-hidden space-y-6">
              <div className="text-center flex w-full justify-center flex-col items-center">
                <div className="flex gap-2 w-full justify-start p-1 h-fit bg-black border-2 border-black ">
                <Image
                  width={200}
                  height={200}
                  src={previewImage}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-4 bg-black border-white p-1 shadow-md"
                />
                <div className="flex flex-col items-start justify-start gap-0">
                <h3 className="text-4xl text-white">{formData.name || formData.username}</h3>
                <h3 className="text-2xl text-white">{`${account}`.slice(0, 6) + '...' + `${account}`.slice(-4)}</h3>
                </div>
                </div>
              </div>

              <div className='text-left w-full px-4 ber capitalize text-xl'>connect other platforms</div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  {socials.map((item,index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-2">
                       <Image
                        width={200}
                        height={200}
                        src={item.icon}
                        alt="Profile"
                        className="w-6 h-6 rounded-full object-cover border-4 bg-black border-white p-1 shadow-md"
                      />
                        <span className="font-mono text-sm text-gray-700">
                          {item.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.title)}
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
                disabled={isLoading || isUploading}
              >
                {isUploading ? 'Uploading Image...' : isLoading ? 'Creating Profile...' : 'Create Profile'}
              </button>
            </div>

            {error && (
              <div className="text-red-500 text-sm mt-4 flex items-center gap-2 justify-center">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
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