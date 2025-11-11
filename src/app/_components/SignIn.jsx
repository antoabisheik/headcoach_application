'use client';
import React, { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../api/firebase';
import { useRouter } from 'next/navigation';
import LoadingOverlay from './LoadingOverlay'; // Import overlay
import { onAuthStateChanged } from "firebase/auth";
import { toast } from 'sonner';

function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const router = useRouter();

  useEffect((
   onAuthStateChanged(auth, (user) =>{
    if(user){
      router.push('gym');
    }
    else{
      console.log("no active session");
    }
   })
  ),[])

 const handleEmailLogin = async (e) => {
    if (e) e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);

      const errorMessage = err.message.includes('INVALID_LOGIN_CREDENTIALS') ||
        err.message.includes('INVALID_PASSWORD') ||
        err.message.includes('EMAIL_NOT_FOUND')
        ? 'Invalid email or password'
        : err.message.includes('TOO_MANY_ATTEMPTS_TRY_LATER')
        ? 'Too many failed attempts. Please try again later.'
        : err.message.includes('USER_DISABLED')
        ? 'This account has been disabled'
        : err.message || 'Failed to sign in';

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();

      const res = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      toast.success('Login successful');
      router.push('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);

      if (err.code === 'auth/popup-blocked') {
        toast.error('Popup was blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        toast.error('An account already exists with the same email');
      } else {
        toast.error(err.message || 'Google login failed');
      }

      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[url('')] bg-gradient-to-r from-[#0D1A1C] to-[#1B2C2E] text-white relative min-h-screen">
      {loading && <LoadingOverlay />} 

      <div className="flex flex-col px-6 mx-30 my-8 w-full max-w-sm z-10">
        <h1 className="text-3xl font-bold text-[#A4FEB7] mb-1">Sign in</h1>
        <p className="text-gray-300 mb-4">
          Please login to continue to your account.
        </p>


        <div className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm mb-1">Email</label>
            <div className="relative">
              <FaEnvelope className="absolute top-3 left-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-white rounded-2xl placeholder-white focus:outline-none"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm mb-1">Password</label>
            <div className="relative">
              <FaLock className="absolute top-3 left-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2 bg-transparent border border-white rounded-2xl placeholder-white focus:outline-none"
              />
            </div>
            <Link href="/fp" className="text-blue-400 text-sm mt-1 inline-block">
              Forgot password
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleEmailLogin}
            className="w-full py-2 rounded-xl bg-[#A4FEB7] text-black font-semibold text-base cursor-pointer"
          >
            Sign in
          </button>

          {/* OR Divider */}
          <div className="text-center text-gray-400 text-sm">or</div>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-2 flex items-center justify-center border border-gray-500 rounded-xl text-white hover:bg-gray-800 cursor-pointer text-sm"
          >
            <FcGoogle className="mr-2 text-lg" />
            Sign in with Google
          </button>

          {/* Sign Up Link */}
          <p className="text-gray-400 text-xs text-center">
            Don’t have an account?{' '}
            <Link href="/signup" className="text-blue-400">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInForm;
