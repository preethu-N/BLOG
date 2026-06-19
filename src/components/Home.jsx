import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import notImg from "../images/not.png";
import not1 from "../images/not1.png";
import not2 from "../images/not2.png";
import not3 from "../images/not3.png";
import not4 from "../images/not4.png";
import not5 from "../images/not5.png";
import not6 from "../images/not6.png";
import not7 from "../images/not7.png";
import not8 from "../images/not8.png";


const gridImages = [not1, not2, not3, not4, not5, not6, not7, not8];

const Home = ({ isLoggedIn }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const featuredPost = posts.length > 0 ? posts[0] : null;
  const gridPosts = posts.slice(1);

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/api/post/posts/")
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load posts");
      })
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Loading stories...</p>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Stories Published Yet</h2>
        <p className="text-gray-500 max-w-sm mb-6">Be the first to share your thoughts, ideas, and creations with the world.</p>
        {isLoggedIn ? (
          <Link
            to="/create-post"
            className="bg-[#5850ec] hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition inline-block cursor-pointer"
          >
            Write a Post
          </Link>
        ) : (
          <Link
            to="/sign"
            className="bg-[#5850ec] hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition inline-block cursor-pointer"
          >
            Sign In to write
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 py-12 sm:py-20">
          <p className="uppercase text-violet-600 font-semibold tracking-widest text-sm">
            Latest Stories
          </p>

          <h1 className="text-4xl sm:text-6xl font-bold mt-4 leading-tight">
            Ideas that resonate.
          </h1>

          <p className="text-gray-500 mt-4 sm:mt-6 text-lg sm:text-xl max-w-xl">
            Thoughtful writing on creativity, productivity and the human
            experience.
          </p>

          {isLoggedIn && (
            <div className="mt-6 sm:mt-8">
              <Link
                to="/create-post"
                className="bg-[#5850ec] hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition inline-block cursor-pointer"
              >
                Write a Post
              </Link>
            </div>
          )}
        </section>

        {/* Search */}
        <section className="border-y">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <button className="px-5 py-2 border rounded-lg font-medium cursor-pointer">
                All Posts
              </button>

              {isLoggedIn && (
                <Link
                  to="/create-post"
                  className="bg-[#5850ec] hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition cursor-pointer text-center"
                >
                  Write a Post
                </Link>
              )}

              <input
                type="text"
                placeholder="Search posts..."
                className="w-full sm:w-640px border rounded-lg px-4 py-2 outline-none"
              />
            </div>

            <p className="text-gray-500 text-sm sm:text-base shrink-0">{gridPosts.length} Posts</p>
          </div>
        </section>

        {/* Featured */}
        <section className="max-w-7xl mx-auto px-6 py-8 sm:py-12">
          <h4 className="text-violet-600 font-semibold uppercase mb-6">
            Featured
          </h4>

          <div className="grid lg:grid-cols-2 border rounded-2xl overflow-hidden">

            <img
              src={notImg}
              alt="featured"
              className="w-full h-64 sm:h-96 lg:h-[500px] object-cover"
            />

            <div className="p-6 sm:p-10 flex flex-col justify-center">
              <div className="flex gap-2 mb-4">
                <span className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-sm">
                  {featuredPost.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-gray-500 mt-4 sm:mt-6 text-base sm:text-lg">
                {featuredPost.content}
              </p>

              <div className="flex items-center justify-between mt-8 sm:mt-10">
                <div>
                  <h4 className="font-semibold text-sm sm:text-base">{featuredPost.author}</h4>

                  <p className="text-xs sm:text-sm text-gray-500">
                    {featuredPost.date} · {featuredPost.readTime}
                  </p>
                </div>

                <Link
                  to={`/post/${featuredPost.id}`}
                  className="border px-5 py-2 rounded-lg hover:bg-gray-100 text-sm sm:text-base cursor-pointer"
                >
                  Read
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gridPosts.map((post, index) => (
              <div
                key={post.id}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition"
              >

                <img
                  src={gridImages[index % gridImages.length]}
                  alt={post.title}
                  className="w-full h-48 sm:h-56 object-cover"
                />

                <div className="p-5">
                  <span className="text-xs bg-violet-100 text-violet-600 px-2 py-1 rounded-full">
                    {post.category}
                  </span>

                  <h3 className="font-bold text-xl mt-4 line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-gray-500 mt-3 text-sm line-clamp-3">
                    {post.content}
                  </p>

                  <div className="flex justify-between items-center mt-6">
                    <span className="text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
                    </span>

                    <Link to={`/post/${post.id}`} className="text-violet-600 hover:text-violet-800 font-semibold flex items-center gap-1">
                      Read →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    );
};

export default Home;