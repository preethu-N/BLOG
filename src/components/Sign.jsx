import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, BookOpen, Layers, Users, Infinity } from 'lucide-react';

const Sign = ({ handleLogin }) => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('alex@echoblog.com');
  const [password, setPassword] = useState('password');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // Registration Flow
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/signup/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username.trim(),
              email: email.trim(),
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          alert("Registration Successful! Please Sign In with your new account.");
          setIsSignUp(false);
          setEmail(data.user.email);
          setPassword('');
        } else {
          console.log(data);
          let errorMsg = "Registration Failed. ";
          for (let key in data) {
            if (Array.isArray(data[key])) {
              errorMsg += `${key}: ${data[key].join(', ')} `;
            } else {
              errorMsg += `${key}: ${data[key]} `;
            }
          }
          alert(errorMsg);
        }
      } catch (error) {
        console.log(error);
        alert("Server Error during registration");
      }
    } else {
      // Sign-In Flow
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/auth/signin/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email.trim(),
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (response.ok) {
          localStorage.setItem("access", data.access);
          localStorage.setItem("refresh", data.refresh);
          localStorage.setItem("username", data.user.username);

          if (handleLogin) {
            handleLogin(data.user.username);
          }

          alert("Login Successful");
          navigate("/");
        } else {
          console.log(data);
          alert(data.error || "Invalid Email/Username or Password");
        }
      } catch (error) {
        console.log(error);
        alert("Server Error during sign in");
      }
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left Column: Branding & Stats */}
      <div className="hidden w-1/2 flex-col justify-between bg-[#5850ec] p-16 text-white lg:flex">
        <div className="flex items-center gap-2"></div>

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

        <div></div>
      </div>

      {/* Right Column: Sign In / Up Form */}
      <div className="flex w-full items-center justify-center px-6 lg:w-1/2 lg:px-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              {isSignUp ? "Sign up to register a new profile" : "Sign in to continue to your blog"}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Username field (Sign Up mode only) */}
              {isSignUp && (
                <div>
                  <label htmlFor="reg-username" className="block text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <input
                    id="reg-username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    placeholder="Enter Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1.5 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                  />
                </div>
              )}

              {/* Email Input */}
              <div>
                <label htmlFor="email-address" className="block text-sm font-semibold text-gray-700">
                  {isSignUp ? "Email Address" : "Email or Username"}
                </label>
                <input
                  id="email-address"
                  name="email"
                  required
                  value={email}
                  placeholder={isSignUp ? "Enter Email" : "Enter Email or Username"}
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
                    placeholder="Enter Password"
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

            {/* Toggle Sign In / Sign Up Link */}
            <div className="flex items-center justify-between mt-2">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  // Clear fields when toggling
                  setUsername('');
                  setPassword('');
                  setEmail('');
                }}
                className="text-sm font-semibold text-[#5850ec] hover:text-indigo-800 transition"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Register Now"}
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-lg bg-[#5850ec] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors cursor-pointer"
              >
                {isSignUp ? "Register" : "Sign in"}
              </button>
            </div>
          </form>

          {/* Demo Credentials Box */}
          {!isSignUp && (
            <div className="rounded-xl bg-gray-50 p-4 border border-gray-100 text-center">
              <p className="text-xs font-medium text-gray-500">Demo credentials:</p>
              <p className="mt-1 text-xs font-mono text-gray-600">
                alex@echoblog.com / password
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sign;