# DevOpsDay Application - Developer Implementation Guide

This guide provides practical templates and examples for implementing new features in the DevOpsDay Medellin 2025 application.

## Quick Start Template for New Features

### 1. Adding a New Entity (Example: Comments)

#### Step 1: Create the Store
```javascript
// File: server/src/store/comments.js
class CommentStore {
  constructor() {
    this.comments = new Map();
    this.counter = 1;
  }

  generateId() {
    return (this.counter++).toString();
  }

  create(commentData) {
    const id = this.generateId();
    const timestamp = new Date();
    
    const comment = {
      id,
      ...commentData,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    this.comments.set(id, comment);
    return comment;
  }

  findById(id) {
    return this.comments.get(id) || null;
  }

  findByTalkId(talkId) {
    return Array.from(this.comments.values())
      .filter(comment => comment.talkId === talkId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  findAll() {
    return Array.from(this.comments.values()).map(comment => ({
      ...comment,
      _id: comment.id
    }));
  }

  update(id, updates) {
    const comment = this.comments.get(id);
    if (!comment) return null;

    const updatedComment = {
      ...comment,
      ...updates,
      updatedAt: new Date()
    };

    this.comments.set(id, updatedComment);
    return updatedComment;
  }

  delete(id) {
    return this.comments.delete(id);
  }
}

const commentsStore = new CommentStore();
module.exports = commentsStore;
```

#### Step 2: Create the Controller
```javascript
// File: server/src/controllers/comments.js
const commentsStore = require('../store/comments');
const talksStore = require('../store/talks');

// Get comments for a talk
exports.getTalkComments = (req, res) => {
  try {
    const { talkId } = req.params;
    
    // Verify talk exists
    const talk = talksStore.findById(talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }

    const comments = commentsStore.findByTalkId(talkId);
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error: error.message });
  }
};

// Create a new comment
exports.createComment = (req, res) => {
  try {
    const { talkId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Comment too long (max 500 characters)' });
    }

    // Verify talk exists
    const talk = talksStore.findById(talkId);
    if (!talk) {
      return res.status(404).json({ message: 'Talk not found' });
    }

    const comment = commentsStore.create({
      talkId,
      userId,
      content: content.trim(),
      authorName: req.user.displayName || 'Anonymous'
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error: error.message });
  }
};

// Update a comment (only by author)
exports.updateComment = (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = commentsStore.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Authorization check
    if (comment.userId !== userId) {
      return res.status(403).json({ message: 'Can only edit your own comments' });
    }

    // Validation
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const updatedComment = commentsStore.update(commentId, {
      content: content.trim()
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error: error.message });
  }
};

// Delete a comment (only by author or admin)
exports.deleteComment = (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.isAdmin;

    const comment = commentsStore.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Authorization check
    if (comment.userId !== userId && !isAdmin) {
      return res.status(403).json({ message: 'Can only delete your own comments' });
    }

    const deleted = commentsStore.delete(commentId);
    if (deleted) {
      res.status(200).json({ message: 'Comment deleted successfully' });
    } else {
      res.status(500).json({ message: 'Failed to delete comment' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error: error.message });
  }
};
```

#### Step 3: Create the Routes
```javascript
// File: server/src/routes/comments.js
const express = require('express');
const router = express.Router();
const commentsController = require('../controllers/comments');
const { authenticate } = require('../utils/jwtAuth');

// Get comments for a talk (public)
router.get('/talk/:talkId', commentsController.getTalkComments);

// Create comment (authenticated)
router.post('/talk/:talkId', authenticate, commentsController.createComment);

// Update comment (authenticated, author only)
router.put('/:commentId', authenticate, commentsController.updateComment);

// Delete comment (authenticated, author or admin)
router.delete('/:commentId', authenticate, commentsController.deleteComment);

module.exports = router;
```

#### Step 4: Register Routes in Main App
```javascript
// File: server/src/index.js
const commentsRoutes = require('./routes/comments');

// Add this line with other route registrations
app.use('/api/comments', commentsRoutes);
```

#### Step 5: Create Frontend Service
```javascript
// File: client/src/services/commentsService.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '';

// Get comments for a talk
export const getTalkComments = async (talkId) => {
  try {
    const response = await axios.get(`${API_URL}/api/comments/talk/${talkId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for talk ${talkId}:`, error);
    throw error;
  }
};

// Create a new comment
export const createComment = async (talkId, content, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/comments/talk/${talkId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

// Update a comment
export const updateComment = async (commentId, content, token) => {
  try {
    const response = await axios.put(
      `${API_URL}/api/comments/${commentId}`,
      { content },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

// Delete a comment
export const deleteComment = async (commentId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/comments/${commentId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
```

#### Step 6: Create React Component
```javascript
// File: client/src/components/TalkComments.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTalkComments, createComment, updateComment, deleteComment } from '../services/commentsService';

function TalkComments({ talkId }) {
  const { currentUser } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    loadComments();
  }, [talkId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await getTalkComments(talkId);
      setComments(commentsData);
    } catch (error) {
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please sign in to comment');
      return;
    }

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      
      const comment = await createComment(talkId, newComment, currentUser.token);
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editContent.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      const updatedComment = await updateComment(commentId, editContent, currentUser.token);
      setComments(comments.map(c => c.id === commentId ? updatedComment : c));
      setEditingId(null);
      setEditContent('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update comment');
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      await deleteComment(commentId, currentUser.token);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return <div className="text-center py-4">Loading comments...</div>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Comment Form */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <div className="mb-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows="3"
              maxLength="500"
              className="w-full p-3 border border-gray-300 rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="text-sm text-gray-500 mt-1">
              {newComment.length}/500 characters
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="mb-6 p-4 bg-gray-100 rounded-md text-center">
          <p>Please sign in to leave a comment.</p>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="font-medium">{comment.authorName}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {formatDate(comment.createdAt)}
                    {comment.updatedAt !== comment.createdAt && ' (edited)'}
                  </span>
                </div>
                
                {currentUser && (currentUser.id === comment.userId || currentUser.isAdmin) && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setEditingId(comment.id);
                        setEditContent(comment.content);
                      }}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="3"
                    maxLength="500"
                    className="w-full p-2 border border-gray-300 rounded-md resize-none mb-2"
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-700">{comment.content}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TalkComments;
```

#### Step 7: Integrate in TalkDetails Page
```javascript
// File: client/src/pages/TalkDetails.js
import TalkComments from '../components/TalkComments';

function TalkDetails() {
  // ... existing code ...

  return (
    <div className="max-w-4xl mx-auto">
      {/* ... existing JSX ... */}
      
      {/* Add this near the end, before closing div */}
      <TalkComments talkId={id} />
    </div>
  );
}
```

### 2. Testing Template

#### Backend Test
```javascript
// File: server/src/controllers/__tests__/comments.test.js
const request = require('supertest');
const app = require('../../index');
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'test-secret');
};

describe('Comments Controller', () => {
  const validToken = generateToken({ id: 'user1', displayName: 'Test User' });
  
  describe('POST /api/comments/talk/:talkId', () => {
    it('should create comment successfully', async () => {
      const response = await request(app)
        .post('/api/comments/talk/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ content: 'Great talk!' })
        .expect(201);

      expect(response.body.content).toBe('Great talk!');
      expect(response.body.userId).toBe('user1');
    });

    it('should reject empty comments', async () => {
      await request(app)
        .post('/api/comments/talk/1')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ content: '' })
        .expect(400);
    });
  });

  describe('GET /api/comments/talk/:talkId', () => {
    it('should fetch comments for talk', async () => {
      const response = await request(app)
        .get('/api/comments/talk/1')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
```

#### Frontend Test
```javascript
// File: client/src/components/__tests__/TalkComments.test.js
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import TalkComments from '../TalkComments';
import { AuthProvider } from '../../contexts/AuthContext';

jest.mock('axios');

const mockUser = {
  id: 'user1',
  token: 'token123',
  displayName: 'Test User'
};

const MockAuthProvider = ({ children, user = mockUser }) => (
  <AuthProvider value={{ currentUser: user }}>
    {children}
  </AuthProvider>
);

test('should display comments', async () => {
  const mockComments = [
    {
      id: '1',
      content: 'Great talk!',
      authorName: 'John Doe',
      createdAt: new Date().toISOString()
    }
  ];

  axios.get.mockResolvedValue({ data: mockComments });

  const { getByText } = render(
    <MockAuthProvider>
      <TalkComments talkId="1" />
    </MockAuthProvider>
  );

  await waitFor(() => {
    expect(getByText('Great talk!')).toBeInTheDocument();
    expect(getByText('John Doe')).toBeInTheDocument();
  });
});

test('should create new comment', async () => {
  axios.get.mockResolvedValue({ data: [] });
  axios.post.mockResolvedValue({
    data: {
      id: '2',
      content: 'New comment',
      authorName: 'Test User',
      createdAt: new Date().toISOString()
    }
  });

  const { getByPlaceholderText, getByText } = render(
    <MockAuthProvider>
      <TalkComments talkId="1" />
    </MockAuthProvider>
  );

  const textarea = getByPlaceholderText('Write a comment...');
  const submitButton = getByText('Post Comment');

  fireEvent.change(textarea, { target: { value: 'New comment' } });
  fireEvent.click(submitButton);

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      '/api/comments/talk/1',
      { content: 'New comment' },
      { headers: { Authorization: 'Bearer token123' } }
    );
  });
});
```

## Error Handling Patterns

### Standard Error Response Format
```javascript
// Success Response
{
  "data": { /* actual data */ },
  "message": "Operation successful"
}

// Error Response
{
  "message": "Human-readable error message",
  "error": "Technical error details (optional)",
  "code": "ERROR_CODE (optional)"
}
```

### Controller Error Handling Template
```javascript
exports.controllerMethod = async (req, res) => {
  try {
    // Validation
    const { requiredField } = req.body;
    if (!requiredField) {
      return res.status(400).json({ message: 'Required field is missing' });
    }

    // Business logic
    const result = await someOperation();
    
    // Success response
    res.status(200).json({ data: result, message: 'Operation successful' });
    
  } catch (error) {
    console.error('Controller error:', error);
    
    // Known errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    // Unknown errors
    res.status(500).json({ 
      message: 'Internal server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
```

This implementation guide provides a complete template for adding new features to the DevOpsDay application while maintaining consistency with existing patterns.