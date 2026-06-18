import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, Layers, Users, Infinity } from 'lucide-react';

const Sign = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('alex@echoblog.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Signing in with:', { email, password });
    if (handleLogin) {
      handleLogin();
    }
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left Column: Branding & Stats */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#5850ec] p-16 text-white lg:flex">
        {/* Top Spacer or Small Logo placement */}
        <div className="flex items-center gap-2">
          {/* EchoBlog Header logo area */}
        </div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center max-w-md mx-auto">
          <div className="mb-6 flex items-center justify-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="text-2xl font-bold tracking-wide">EchoBlog</span>
          </div>
          
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight">
            Ideas worth sharing.
          </h1>
          
          <p className="text-lg text-indigo-100 font-light leading-relaxed">
            A place for thoughtful writing, genuine connection, and ideas that echo long after you read them.
          </p>

          {/* Stats Grid */}
          <div className="mt-12 grid grid-cols-3 gap-4 w-full">
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/5">
              <span className="text-2xl font-black">4+</span>
              <span className="text-xs font-medium text-indigo-200 mt-1">Posts</span>
            </div>
            
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/5">
              <span className="text-2xl font-black">3+</span>
              <span className="text-xs font-medium text-indigo-200 mt-1">Writers</span>
            </div>
            
            <div className="flex flex-col items-center justify-center rounded-2xl bg-white/10 p-5 backdrop-blur-sm border border-white/5">
              <span className="text-2xl font-black flex items-center justify-center leading-none">
                <Infinity className="h-6 w-6" />
              </span>
              <span className="text-xs font-medium text-indigo-200 mt-1">Readers</span>
            </div>
          </div>
        </div>

        {/* Bottom Spacer */}
        <div></div>
      </div>

      {/* Right Column: Sign In Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Sign in to continue to your blog
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  value={email}
                  placeholder='Enter Email'
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    placeholder='Enter Password'
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 pl-4 pr-11 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" aria-hidden="true" />
                    ) : (
                      <Eye className="h-5 w-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-[#5850ec] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>

          {/* Demo Credentials Box */}
          <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-center">
            <p className="text-xs font-medium text-gray-500">Demo credentials:</p>
            <p className="mt-1 text-xs font-mono text-gray-600">
              alex@echoblog.com / password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sign;