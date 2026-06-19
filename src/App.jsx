import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from "./components/Home";
import Sign from "./components/Sign";
import Navbar from "./components/Navbar";
import PostDetails from './components/PostDetails';
import CreatePost from './components/CreatePost';
import { posts as staticPosts } from './data/Post';

function App() {
  // Store whether the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Store posts created by the user
  const [customPosts, setCustomPosts] = useState([]);

  // Check login state and load posts when the application loads
  useEffect(() => {
    // Check if user has logged in before
    const userLoggedIn = localStorage.getItem('isLoggedIn');
    if (userLoggedIn === 'true') {
      setIsLoggedIn(true);
    }

    // Load any custom posts that the user wrote
    const savedCustom = localStorage.getItem('customPosts');
    if (savedCustom) {
      try {
        setCustomPosts(JSON.parse(savedCustom));
      } catch (e) {
        console.error("Failed to parse custom posts:", e);
      }
    }
  }, []);

  // Function to log in the user
  const handleLogin = (username) => {
    localStorage.setItem('isLoggedIn', 'true');
    if (username) {
      localStorage.setItem('username', username);
    }
    setIsLoggedIn(true);
  };

  // Function to log out the user
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsLoggedIn(false);
  };

  // Merge static posts from file and custom posts from localStorage
  const allPosts = [...staticPosts, ...customPosts];

  // Function to create a new post
  const handleCreatePost = (newPost) => {
    // Loop to find the maximum ID and add 1
    let maxId = 0;
    for (let i = 0; i < allPosts.length; i++) {
      if (allPosts[i].id > maxId) {
        maxId = allPosts[i].id;
      }
    }
    const nextId = maxId + 1;

    // Build the new post object
    const postWithId = {
      id: nextId,
      title: newPost.title,
      desc: newPost.desc,
      content: newPost.content,
      category: newPost.category,
      image: newPost.image || "/images/not.png",
      author: newPost.author,
      date: newPost.date,
      readTime: newPost.readTime,
      featured: false
    };

    const updatedCustom = [...customPosts, postWithId];
    setCustomPosts(updatedCustom);
    localStorage.setItem('customPosts', JSON.stringify(updatedCustom));
  };

  // Function to edit an existing post
  const handleEditPost = (id, updatedPost) => {
    const updatedCustom = [];
    
    // Loop and find the post to update
    for (let i = 0; i < customPosts.length; i++) {
      const currentPost = customPosts[i];
      if (currentPost.id === Number(id)) {
        // Replace it with updated data
        const merged = {
          ...currentPost,
          ...updatedPost
        };
        updatedCustom.push(merged);
      } else {
        updatedCustom.push(currentPost);
      }
    }
    
    setCustomPosts(updatedCustom);
    localStorage.setItem('customPosts', JSON.stringify(updatedCustom));
  };

  // Function to delete a post
  const handleDeletePost = (id) => {
    const updatedCustom = [];
    
    // Loop and add all posts EXCEPT the one we want to delete
    for (let i = 0; i < customPosts.length; i++) {
      if (customPosts[i].id !== Number(id)) {
        updatedCustom.push(customPosts[i]);
      }
    }
    
    setCustomPosts(updatedCustom);
    localStorage.setItem('customPosts', JSON.stringify(updatedCustom));
  };

  return (
    <BrowserRouter>
      {/* Navigation Bar */}
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      {/* Route Views */}
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