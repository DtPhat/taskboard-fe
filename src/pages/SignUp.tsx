import React, { useState } from 'react';
import { useAuth } from '../contexts/lib/auth-context';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function SignUp() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'details' | 'verification'>('details');
  const { signup, verifySignin, error } = useAuth();
  const navigate = useNavigate();

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, name, avatar });
      setStep('verification');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifySignin(email, verificationCode);
      navigate('/boards');
    } catch (err) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {step === 'details' ? (
          <form className="mt-8 space-y-6" onSubmit={handleDetailsSubmit}>
            <div className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatar} alt={name} />
                  <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="w-full">
                  <Label htmlFor="avatar">Avatar URL (optional)</Label>
                  <Input
                    id="avatar"
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleVerificationSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="verification-code">Verification code</Label>
                <Input
                  id="verification-code"
                  type="text"
                  required
                  placeholder="Enter verification code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Verify and create account
            </Button>
          </form>
        )}
      </div>
    </div>
  );
} 