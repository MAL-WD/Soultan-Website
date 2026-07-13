import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setCredentials } from '../slices/authSlice';
import axios from 'axios';

const GoogleLoginButton = ({ redirect = '/' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        // Render the button
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'),
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            locale: 'en',
          }
        );
      }
    };

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      // Decode JWT token from Google
      const base64Url = response.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const googleData = JSON.parse(jsonPayload);

      // Send to backend
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          googleId: googleData.sub,
          email: googleData.email,
          name: googleData.name,
          picture: googleData.picture,
        }
      );

      if (res.data.success) {
        dispatch(setCredentials(res.data.data));
        navigate(redirect);
        toast.success('Login successful!');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div id="google-signin-button" className="w-full flex justify-center"></div>
  );
};

export default GoogleLoginButton;
