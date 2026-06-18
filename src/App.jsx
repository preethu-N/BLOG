import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "./components/Home";
import Sign from "./components/Sign";
import Navbar from "./components/Navbar";
import PostDetails from './components/PostDetails';
import CreatePost from './components/CreatePost';
import { posts as staticPosts } from './data/Post';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [customPosts, setCustomPosts] = useState([]);

  useEffect(() => {
    // Check logged in state
    const userLoggedIn = localStorage.getItem('isLoggedIn');
    if (userLoggedIn === 'true') {
      setIsLoggedIn(true);
    }

    // Load custom posts from localStorage
    const savedCustom = localStorage.getItem('customPosts');
    if (savedCustom) {
      try {
        setCustomPosts(JSON.parse(savedCustom));
      } catch (e) {
        console.error("Failed to parse custom posts:", e);
      }
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const allPosts = [...staticPosts, ...customPosts];

  const handleCreatePost = (newPost) => {
    const nextId = allPosts.length > 0 ? Math.max(...allPosts.map(p => p.id)) + 1 : 1;
    const postWithId = {
      ...newPost,
      id: nextId,
      featured: false
    };
    const updatedCustom = [...customPosts, postWithId];
    setCustomPosts(updatedCustom);
    localStorage.setItem('customPosts', JSON.stringify(updatedCustom));
  };

  const handleEditPost = (id, updatedPost) => {
    const updatedCustom = customPosts.map(p => p.id === Number(id) ? { ...p, ...updatedPost } : p);
    setCustomPosts(updatedCustom);
    localStorage.setItem('customPosts', JSON.stringify(updatedCustom));
  };

  const handleDeletePost = (id) => {
    const updatedCustom = customPosts.filter(p => p.id !== Number(id));
    setCustomPosts(updatedCustom);
    localStorage.setItem('customPosts', JSON.stringify(updatedCustom));
  };

  return (
    <BrowserRouter>
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home isLoggedIn={isLoggedIn} posts={allPosts} />} />
        <Route path="/home" element={<Home isLoggedIn={isLoggedIn} posts={allPosts} />} />
        <Route path="/sign" element={<Sign handleLogin={handleLogin} />} />
        <Route 
          path="/post/:id" 
          element={<PostDetails posts={allPosts} isLoggedIn={isLoggedIn} handleDeletePost={handleDeletePost} />} 
        />
        <Route path="/create-post" element={<CreatePost handleCreatePost={handleCreatePost} />} />
        <Route 
          path="/edit-post/:id" 
          element={<CreatePost posts={allPosts} handleEditPost={handleEditPost} />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;