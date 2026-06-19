import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const PostDetails = ({ isLoggedIn, handleDeletePost }) => {
  const { id } = useParams(); // Get the post ID from the URL path
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // State variables for comments
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  // Load comments for this specific post from the backend API when page loads
  const fetchComments = () => {
    fetch(`http://127.0.0.1:8000/api/comment/comments/?post=${id}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load comments");
      })
      .then((data) => setComments(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setLoading(true);
    fetch(`http://127.0.0.1:8000/api/post/posts/${id}/`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Post not found");
      })
      .then((data) => {
        setPost(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [id]);

  // Function to add a comment
  const handleAddComment = (e) => {
    e.preventDefault();
    if (commentText.trim() === "") {
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login first to post a comment");
      navigate("/sign");
      return;
    }

    fetch("http://127.0.0.1:8000/api/comment/comments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        post: Number(id),
        text: commentText.trim()
      })
    })
      .then((res) => {
        if (res.ok) {
          setCommentText("");
          fetchComments();
        } else {
          alert("Failed to add comment");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server error when adding comment");
      });
  };

  // Start editing a comment
  const handleStartEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.text);
  };

  // Save the edited comment
  const handleSaveComment = (commentId) => {
    if (editingCommentText.trim() === "") {
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login first");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/comment/comments/${commentId}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        text: editingCommentText.trim()
      })
    })
      .then((res) => {
        if (res.ok) {
          setEditingCommentId(null);
          fetchComments();
        } else {
          alert("Failed to save comment. You might not be the owner.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server error when updating comment");
      });
  };

  // Delete a comment
  const handleDeleteComment = (commentId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this comment?");
    if (!isConfirmed) {
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login first");
      return;
    }

    fetch(`http://127.0.0.1:8000/api/comment/comments/${commentId}/`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 204 || res.ok) {
          fetchComments();
        } else {
          alert("Failed to delete comment. You might not be the owner.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("Server error when deleting comment");
      });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
        <p className="text-gray-500 mt-2">Fetching story details from server...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50 px-4">
        <h2 className="text-2xl font-bold text-gray-900">Post Not Found</h2>
        <p className="text-gray-500 mt-2">The article you are looking for does not exist or has been removed.</p>
        <Link to="/" className="mt-6 px-6 py-2 bg-violet-600 text-white font-medium rounded-lg hover:bg-violet-700 transition">
          Go back home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-12">
      <article className="max-w-3xl mx-auto px-6">

        {/* Back navigation button */}
        <Link to="/" className="inline-flex items-center text-sm font-semibold text-violet-600 hover:text-violet-800 transition mb-8 group">
          <span className="mr-1 transform transition-transform group-hover:-translate-x-1">←</span> Back to stories
        </Link>

        {/* Category Label */}
        <div className="mb-4">
          <span className="bg-violet-100 text-violet-600 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
            {post.category}
          </span>
        </div>

        {/* Blog Post Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Author details, date, and edit/delete actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 border-y py-4 border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-violet-600 text-white flex items-center justify-center font-bold text-lg shadow-inner">
              {post.author ? post.author.charAt(0) : "A"}
            </div>
            <div>
              <p className="font-semibold text-gray-900">{post.author || "Anonymous"}</p>
              <p className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Show Edit and Delete buttons only if user is logged in and is the author of this post */}
          {isLoggedIn && post.author === localStorage.getItem("username") && (
            <div className="flex items-center gap-2">
              <Link
                to={`/edit-post/${post.id}`}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer"
              >
                Edit Post
              </Link>
              <button
                onClick={() => {
                  const confirmDelete = window.confirm("Are you sure you want to delete this post?");
                  if (confirmDelete) {
                    const token = localStorage.getItem("access");
                    fetch(`http://127.0.0.1:8000/api/post/posts/${post.id}/`, {
                      method: "DELETE",
                      headers: {
                        "Authorization": `Bearer ${token}`
                      }
                    })
                    .then((res) => {
                      if (res.status === 204 || res.ok) {
                        if (handleDeletePost) {
                          handleDeletePost(post.id);
                        }
                        navigate("/");
                      } else {
                        alert("Failed to delete post. You might not be the owner.");
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                      alert("Server error when deleting post");
                    });
                  }
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition cursor-pointer"
              >
                Delete Post
              </button>
            </div>
          )}
        </div>

        {/* Main Cover Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-10">
          <img
            src={post.image || "https://via.placeholder.com/800x400"}
            alt={post.title}
            className="w-full h-64 sm:h-96 object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Main Post Content Body */}
        <div className="text-gray-700 text-lg leading-relaxed space-y-6">
          {post.content.split("\n\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {/* --- Comments Section --- */}
        <section className="mt-16 border-t pt-10 border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Comments ({comments.length})
          </h3>

          {/* New Comment Submission Form */}
          {isLoggedIn ? (
            <form onSubmit={handleAddComment} className="mb-8">
              <textarea
                rows={3}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Join the conversation..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none"
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={commentText.trim() === ""}
                  className={`px-5 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition cursor-pointer ${commentText.trim() !== ""
                      ? 'bg-violet-600 hover:bg-violet-700'
                      : 'bg-indigo-300 cursor-not-allowed'
                    }`}
                >
                  Post Comment
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 border rounded-xl p-5 text-center mb-8">
              <p className="text-gray-600 text-sm">
                Please{" "}
                <Link to="/sign" className="text-violet-600 font-bold hover:underline">
                  Sign In
                </Link>{" "}
                to join the discussion and add comments.
              </p>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-4 p-4 border rounded-xl bg-gray-50/50">
                  {/* User Initial Circle */}
                  <div className="w-10 h-10 rounded-full bg-indigo-100 text-[#5850ec] flex items-center justify-center font-bold shrink-0 shadow-sm">
                    {comment.user ? comment.user.charAt(0) : "A"}
                  </div>

                  {/* Comment Details */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-gray-900 text-sm">{comment.user}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Edit and Delete actions for own comments */}
                      {isLoggedIn && comment.user === localStorage.getItem("username") && editingCommentId !== comment.id && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditComment(comment)}
                            className="text-xs text-gray-500 hover:text-violet-600 font-medium transition cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-xs text-gray-400 hover:text-red-600 font-medium transition cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Inline Editor Form */}
                    {editingCommentId === comment.id ? (
                      <div className="mt-2 space-y-2">
                        <input
                          type="text"
                          value={editingCommentText}
                          onChange={(e) => setEditingCommentText(e.target.value)}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleSaveComment(comment.id)}
                            className="px-3 py-1 bg-violet-600 hover:bg-violet-700 text-white rounded text-xs font-semibold transition cursor-pointer"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCommentId(null)}
                            className="px-3 py-1 border border-gray-300 hover:bg-gray-100 text-gray-700 rounded text-xs font-medium transition cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 text-sm mt-1.5 whitespace-pre-line">
                        {comment.text}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic text-center py-6 text-sm">
                No comments yet. Be the first to share your thoughts!
              </p>
            )}
          </div>
        </section>
      </article>
    </div>
  );
};

export default PostDetails;