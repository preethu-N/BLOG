import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Eye, EyeOff, ChevronLeft, Plus, X } from 'lucide-react';

const CreatePost = ({ handleCreatePost, handleEditPost, posts = [] }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImageDesc, setCoverImageDesc] = useState('');
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState('');

  // Mode state
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  // Populate data on edit mode
  useEffect(() => {
    if (id && posts.length > 0) {
      const existingPost = posts.find((p) => p.id === Number(id));
      if (existingPost) {
        setTitle(existingPost.title || '');
        setExcerpt(existingPost.desc || '');
        setContent(existingPost.content || '');
        setCoverImageDesc(existingPost.coverImageDesc || '');
        setTags(existingPost.tags || (existingPost.category ? [existingPost.category] : []));
      }
    }
  }, [id, posts]);

  // Computations
  const wordCount = useMemo(() => {
    if (!content) return 0;
    return content.trim().split(/\s+/).filter(w => w.length > 0).length;
  }, [content]);

  const readTime = useMemo(() => {
    return Math.max(1, Math.ceil(wordCount / 200));
  }, [wordCount]);

  // Tag Handlers
  const handleAddTag = (e) => {
    e.preventDefault();
    const trimmed = currentTag.trim();
    if (trimmed && tags.length < 5 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(e);
    }
  };

  // Publish/Edit handler
  const handlePublish = () => {
    if (!title.trim() || !content.trim()) return;

    if (id) {
      const updatedPost = {
        title,
        desc: excerpt.trim() || (content.length > 100 ? content.substring(0, 97) + "..." : content),
        content,
        category: tags.length > 0 ? tags[0] : "General",
        coverImageDesc,
        tags,
        readTime: `${readTime} min read`
      };
      if (handleEditPost) {
        handleEditPost(id, updatedPost);
      }
      navigate(`/post/${id}`);
    } else {
      // Use current date
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const today = new Date().toLocaleDateString('en-US', options);

      const newPost = {
        title,
        desc: excerpt.trim() || (content.length > 100 ? content.substring(0, 97) + "..." : content),
        content,
        category: tags.length > 0 ? tags[0] : "General",
        image: "/images/not.png", // static default image
        author: "Alex Morgan", // current demo user
        date: today,
        readTime: `${readTime} min read`,
        coverImageDesc,
        tags
      };

      if (handleCreatePost) {
        handleCreatePost(newPost);
      }
      navigate('/');
    }
  };

  // Custom basic markdown parser
  const renderMarkdown = (text) => {
    if (!text || text.trim() === '') {
      return <p className="text-gray-400 italic">Your content will appear here</p>;
    }
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-900 mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-bold text-gray-800 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      // Bullets
      if (line.startsWith('- ')) {
        return (
          <li key={index} className="list-disc ml-6 text-gray-700 mb-1">
            {line.replace('- ', '')}
          </li>
        );
      }
      // Empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-3"></div>;
      }

      // Inline Bold formatting
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIndex = 0;
      let match;
      while ((match = boldRegex.exec(line)) !== null) {
        if (match.index > lastIndex) {
          parts.push(line.substring(lastIndex, match.index));
        }
        parts.push(
          <strong key={match.index} className="font-extrabold text-gray-955">
            {match[1]}
          </strong>
        );
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < line.length) {
        parts.push(line.substring(lastIndex));
      }

      return (
        <p key={index} className="text-gray-700 leading-relaxed mb-3">
          {parts.length > 0 ? parts : line}
        </p>
      );
    });
  };

  const isFormValid = title.trim() !== '' && content.trim() !== '';

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Top Header Actions */}
        <header className="flex items-center justify-between border-b pb-6 mb-8">
          <div className="flex items-center gap-3">
            <Link
              to={id ? `/post/${id}` : "/"}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition font-medium"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{id ? 'Edit Post' : 'New Post'}</h1>
          </div>

          <div className="flex items-center gap-3">
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
              className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm transition cursor-pointer ${
                isFormValid 
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
            
            {/* Title */}
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

            {/* Excerpt */}
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

            {/* Content */}
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

            {/* Cover Image Description */}
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

            {/* Tags */}
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

              {/* Tag Pills */}
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

            {/* Bottom Actions */}
            <div className="flex items-center gap-3 border-t pt-6 mt-10">
              <button
                type="button"
                onClick={handlePublish}
                disabled={!isFormValid}
                className={`px-6 py-2.5 rounded-lg text-sm font-semibold text-white shadow-sm transition cursor-pointer ${
                  isFormValid 
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
            <h1 className={`text-4xl font-extrabold tracking-tight ${title ? 'text-gray-900' : 'text-gray-400'}`}>
              {title || "Post title will appear here"}
            </h1>

            {/* Excerpt Preview */}
            <div className="border-l-4 border-violet-200 pl-4 py-1 italic">
              <p className={`text-lg ${excerpt ? 'text-gray-600' : 'text-gray-400'}`}>
                {excerpt || "Excerpt will appear here"}
              </p>
            </div>

            {/* Image Box Preview */}
            <div className="w-full h-[400px] rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center text-center p-6 relative overflow-hidden select-none">
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
