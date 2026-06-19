import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, Plus, X } from 'lucide-react';

const CreatePost = ({ handleCreatePost, handleEditPost, posts = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the post ID from URL if editing

  // Form input states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageDesc, setCoverImageDesc] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  // Page mode state (whether we are previewing the post)
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // If we have an ID in the URL, it means we are editing an existing post.
  // Load the post data when the page loads.
  useEffect(() => {
    if (id) {
      // First try to find in posts prop if passed, otherwise fetch from backend
      let existingPost = null;
      if (posts.length > 0) {
        for (let i = 0; i < posts.length; i++) {
          if (posts[i].id === Number(id)) {
            existingPost = posts[i];
            break;
          }
        }
      }

      if (existingPost) {
        setTitle(existingPost.title || '');
        setExcerpt(existingPost.desc || '');
        setContent(existingPost.content || '');
        setCoverImageDesc(existingPost.coverImageDesc || '');
        setTags(existingPost.tags || (existingPost.category ? [existingPost.category] : []));
      } else {
        // Fetch from backend
        fetch(`http://127.0.0.1:8000/api/post/posts/${id}/`)
          .then((res) => {
            if (res.ok) return res.json();
            throw new Error("Failed to load post");
          })
          .then((data) => {
            setTitle(data.title || '');
            setContent(data.content || '');
            setTags(data.category ? [data.category] : []);
          })
          .catch((err) => console.log(err));
      }
    }
  }, [id, posts]);

  // --- Calculations for Word Count and Reading Time ---
  let wordCount = 0;
  if (content && content.trim() !== "") {
    const wordsArray = content.trim().split(" ");
    // Remove empty spaces from the array
    const cleanWords = wordsArray.filter(function (word) {
      return word !== "";
    });
    wordCount = cleanWords.length;
  }

  // Assume average reading speed of 200 words per minute
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // --- Tag Management ---
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmedTag = currentTag.trim();

    // Tag validation: not empty, max 5 tags, no duplicates
    if (trimmedTag === "") {
      return;
    }
    if (tags.length >= 5) {
      return;
    }
    if (tags.includes(trimmedTag)) {
      return;
    }

    setTags([...tags, trimmedTag]);
    setCurrentTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    // Keep all tags except the one we want to remove
    const newTags = tags.filter(function (tag) {
      return tag !== tagToRemove;
    });
    setTags(newTags);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  // --- Publish or Save Changes ---
  const handlePublish = async () => {
    if (title.trim() === "" || content.trim() === "") {
      alert("Title and Content are required");
      return;
    }

    const token = localStorage.getItem("access");

    if (!token) {
      alert("Please login first");
      navigate("/sign");
      return;
    }

    try {
      const url = id
        ? `http://127.0.0.1:8000/api/post/posts/${id}/`
        : "http://127.0.0.1:8000/api/post/posts/";
      const method = id ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: content,
          category: tags.length > 0 ? tags[0] : "General",
          image: "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (id) {
          if (handleEditPost) {
            handleEditPost(id, data);
          }
          alert("Post Saved Successfully");
          navigate(`/post/${id}`);
        } else {
          if (handleCreatePost) {
            handleCreatePost(data);
          }
          alert("Post Created Successfully");
          navigate("/");
        }
      } else {
        console.log(data);
        alert(id ? "Failed to save post" : "Failed to create post");
      }
    } catch (error) {
      console.log(error);
      alert("Server Error");
    }
  };

  // --- Simple Custom Markdown Parser ---
  const renderMarkdown = (text) => {
    if (!text || text.trim() === '') {
      return <p className="text-gray-400 italic">Your content will appear here</p>;
    }

    const lines = text.split('\n');
    const renderedElements = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // 1. Heading 2 (## Heading)
      if (line.indexOf('## ') === 0) {
        const headingText = line.substring(3);
        renderedElements.push(
          <h2 key={i} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
            {headingText}
          </h2>
        );
        continue;
      }

      // 2. Heading 3 (### Heading)
      if (line.indexOf('### ') === 0) {
        const headingText = line.substring(4);
        renderedElements.push(
          <h3 key={i} className="text-xl font-bold text-gray-800 mt-4 mb-2">
            {headingText}
          </h3>
        );
        continue;
      }

      // 3. Bullet list item (- Item)
      if (line.indexOf('- ') === 0) {
        const bulletText = line.substring(2);
        renderedElements.push(
          <li key={i} className="list-disc ml-6 text-gray-700 mb-1">
            {bulletText}
          </li>
        );
        continue;
      }

      // 4. Empty line spacing
      if (line.trim() === '') {
        renderedElements.push(<div key={i} className="h-3"></div>);
        continue;
      }

      // 5. Bold text parsing (**text**)
      if (line.indexOf('**') !== -1) {
        const parts = line.split('**');
        const paragraphParts = [];
        for (let j = 0; j < parts.length; j++) {
          if (j % 2 === 1) {
            // Odd numbers are inside the bold symbols
            paragraphParts.push(
              <strong key={j} className="font-extrabold text-gray-950">
                {parts[j]}
              </strong>
            );
          } else {
            paragraphParts.push(parts[j]);
          }
        }
        renderedElements.push(
          <p key={i} className="text-gray-700 leading-relaxed mb-3">
            {paragraphParts}
          </p>
        );
        continue;
      }

      // 6. Regular text line
      renderedElements.push(
        <p key={i} className="text-gray-700 leading-relaxed mb-3">
          {line}
        </p>
      );
    }

    return renderedElements;
  };

  // Check if form is valid (Title and Content are required)
  const isFormValid = title.trim() !== '' && content.trim() !== '';

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">

        {/* Top Header Section */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 mb-8">
          <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
            <Link
              to={id ? `/post/${id}` : "/"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{id ? 'Edit Post' : 'New Post'}</h1>
          </div>

          <div className="flex items-center justify-end sm:justify-start gap-3 w-full sm:w-auto">
            {isPreviewMode ? (
              <button
                onClick={() => setIsPreviewMode(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
              >
                <EyeOff className="w-4 h-4 mr-2" /> Edit
              </button>
            ) : (
              <button
                onClick={() => setIsPreviewMode(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-2" /> Preview
              </button>
            )}

            <button
              onClick={handlePublish}
              disabled={!isFormValid}
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition cursor-pointer ${isFormValid
                  ? 'bg-violet-600 hover:bg-violet-700'
                  : 'bg-indigo-300 cursor-not-allowed'
                }`}
            >
              {id ? 'Save' : 'Publish'}
            </button>
          </div>
        </header>

        {/* --- EDIT MODE --- */}
        {!isPreviewMode && (
          <div className="space-y-6">

            {/* Title Input */}
            <div>
              <label htmlFor="post-title" className="block text-sm font-bold text-gray-800 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="post-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your post a compelling title..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-base"
              />
            </div>

            {/* Excerpt Input */}
            <div>
              <label htmlFor="post-excerpt" className="block text-sm font-bold text-gray-800 mb-2">
                Excerpt <span className="text-gray-400 font-normal">(optional — auto-generated if empty)</span>
              </label>
              <textarea
                id="post-excerpt"
                rows={3}
                maxLength={300}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A brief summary that appears in the post list..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm resize-none"
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {excerpt.length}/300
              </div>
            </div>

            {/* Content Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="post-content" className="text-sm font-bold text-gray-800">
                  Content <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-gray-500">
                  {readTime} min read · {wordCount} words
                </span>
              </div>
              <textarea
                id="post-content"
                rows={12}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your post here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none font-mono text-sm resize-y"
              />
            </div>

            {/* Cover Image Description Input */}
            <div>
              <label htmlFor="cover-desc" className="block text-sm font-bold text-gray-800 mb-2">
                Cover Image Description
              </label>
              <input
                id="cover-desc"
                type="text"
                value={coverImageDesc}
                onChange={(e) => setCoverImageDesc(e.target.value)}
                placeholder="Describe the cover image, e.g. 'minimalist desk with notebook, morning light'"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none text-sm"
              />
            </div>

            {/* Tags Input Section */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Tags <span className="text-gray-400 font-normal">(up to 5)</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Add a tag and press Enter..."
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-violet-500 outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={tags.length >= 5}
                  className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1 cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              {/* Tags Pills List */}
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-violet-50 border border-violet-100 rounded-full text-xs font-semibold text-violet-700"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-violet-500 hover:text-violet-800 hover:bg-violet-100 rounded-full p-0.5 transition cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Form Action Buttons */}
            <div className="flex items-center gap-3 border-t pt-6 mt-10">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!isFormValid}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition cursor-pointer ${isFormValid
                    ? 'bg-violet-600 hover:bg-violet-700'
                    : 'bg-indigo-300 cursor-not-allowed'
                  }`}
              >
                {id ? 'Save Changes' : 'Publish Post'}
              </button>
              <Link
                to={id ? `/post/${id}` : "/"}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                Cancel
              </Link>
            </div>

          </div>
        )}

        {/* --- PREVIEW MODE --- */}
        {isPreviewMode && (
          <div className="space-y-6">

            {/* Title Preview */}
            <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${title ? 'text-gray-900' : 'text-gray-400'}`}>
              {title || "Post title will appear here"}
            </h1>

            {/* Excerpt Preview */}
            <div className="border-l-4 border-violet-200 pl-4 py-1 italic">
              <p className={`text-base sm:text-lg ${excerpt ? 'text-gray-600' : 'text-gray-400'}`}>
                {excerpt || "Excerpt will appear here"}
              </p>
            </div>

            {/* Image Box Preview */}
            <div className="w-full h-56 sm:h-96 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-center p-6 relative overflow-hidden select-none">
              {coverImageDesc ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold mb-2">
                    AI
                  </div>
                  <h4 className="font-bold text-gray-800 text-lg">AI cover image generated</h4>
                  <p className="text-sm text-gray-500 max-w-sm">"{coverImageDesc}"</p>
                </div>
              ) : (
                <span className="text-gray-400 font-medium text-lg">
                  Cover image preview not available
                </span>
              )}
            </div>

            {/* Content Preview */}
            <div className="prose max-w-none border-t pt-8">
              {renderMarkdown(content)}
            </div>

            {/* Tags display in preview */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 border-t pt-6">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-semibold text-gray-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CreatePost;
