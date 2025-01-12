import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface PopupAdProps {
  onClose: () => void;
}

export function PopupAd({ onClose }: PopupAdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [imageIndex, setImageIndex] = useState(0); // To track the current imag
  const navigate = useNavigate();

  // List of images to display in the popup
  const images = [
    'https://images.pexels.com/photos/3786215/pexels-photo-3786215.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=800',
  ];

  useEffect(() => {
    // Debug: Ensure this is firing
    console.log('useEffect fired: Popup will show in 10 seconds.');

    // Show the popup after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(true);
      console.log('Popup should now be visible.');
    }, 10000); // 10 seconds delay

    // Set up an interval to change the image every 5 seconds
    const imageChangeInterval = setInterval(() => {
      setImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => {
      clearTimeout(timer); // Cleanup the timer
      clearInterval(imageChangeInterval); // Cleanup the interval
    };
  }, []); // Empty dependency array to run this effect once on mount

  const handleClose = () => {
    setIsVisible(false); // Close the popup
    onClose(); // Trigger the onClose callback passed from the parent component
  };

  const handleBookNow = () => {
    navigate('/symptoms'); // Navigate to the symptoms page
    setIsVisible(false); // Close the popup
  };

  if (!isVisible) return null; // If the popup is not visible, don't render it

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fadeIn">
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 ease-in-out animate-slideIn">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        {/* Ad content */}
        <div className="p-6">
          {/* Image with smooth transition */}
          <div className="aspect-video mb-4 bg-blue-100 rounded-lg overflow-hidden">
            <img
              src={images[imageIndex]}
              alt="Hospital Services"
              className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
              style={{
                opacity: 1, // Ensure image is visible during transition
              }}
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Special Health Package
          </h2>
          
          <p className="text-gray-600 mb-4">
            Get comprehensive health checkups at 30% off! Limited time offer for new patients.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Full Body Checkup
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Cardiac Screening
            </div>
            <div className="flex items-center text-gray-700">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M5 13l4 4L19 7"></path>
              </svg>
              Diabetes Screening
            </div>
          </div>

          {/* Book Now button */}
          <button
            onClick={handleBookNow}
            className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
