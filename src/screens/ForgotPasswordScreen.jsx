import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import FormContainer from '../components/FormContainer';
import Loader from '../components/Loader';
import { PageTransition, SlideUp } from '../components/Animations';
import axios from 'axios';

const ForgotPasswordScreen = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email,
      });
      setResetToken(response.data.resetToken);
      setStep('reset');
      toast.success('Reset token sent! Check your email or use the token provided.');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error sending reset token');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${resetToken}`,
        {
          password: newPassword,
          passwordConfirm: confirmPassword,
        }
      );
      toast.success('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error resetting password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && step === 'email') {
    return <Loader />;
  }

  return (
    <FormContainer>
      <PageTransition>
        <SlideUp delay={0.1}>
          <Card className="border-0 shadow-lg">
        {step === 'email' ? (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">{t('forgotPassword') || 'Forgot Password'}</CardTitle>
              <CardDescription className="text-center">
                Enter your email address and we'll send you a reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#02110c] hover:bg-[#02110c]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-center text-gray-500">
                Remember your password?{' '}
                <Link to="/login" className="text-[#f2c161] hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </CardFooter>
          </>
        ) : (
          <>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Enter your new password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-[#02110c] hover:bg-[#02110c]/90 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password'}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-sm text-[#f2c161] hover:underline font-medium"
              >
                Use a different email
              </button>
            </CardFooter>
          </>
        )}
      </Card>
        </SlideUp>
      </PageTransition>
    </FormContainer>
  );
};

export default ForgotPasswordScreen;
