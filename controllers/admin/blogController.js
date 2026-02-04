const blogService = require('../../services/blogService');
const mongoose = require('mongoose');
const User = require('../../models/userModel');
const blogModel = require('../../models/blogModel');

async function getAllAdminBlogPosts(req, res) {
  try {
      const posts = await blogModel.find();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching blog posts', success: false, error: true });
    }
}

async function getBlogPostById(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog post ID', success: false, error: true });
    }
    const post = await blogService.getBlogById(id);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found', success: false, error: true });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getBlogPostById:", error);
    res.status(500).json({ message: 'Error fetching blog post by ID', success: false, error: true });
  }
}

async function createBlogPost(req, res) {
  try {
    // Assuming req.user is populated by authentication middleware
    const authorId = req.user.userId;

    // Fetch user to get the author's name
    const authorUser = await User.findById(authorId);

    if (!authorUser) {
      return res.status(404).json({ message: 'Author not found', success: false, error: true });
    }

    req.body.authorId = authorId;
    // req.body.author = authorUser.name || authorUser.username; // Use name or username
    console.log('Creating blog post with data:', req.body);
    const newPost = await blogService.createBlog(req.body);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createBlogPost:", error);
    res.status(500).json({ message: 'Error creating blog post', success: false, error: true });
  }
}

async function updateBlogPost(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog post ID', success: false, error: true });
    }

    // Ensure authorId is not updated from req.body
    if (req.body.authorId) {
      delete req.body.authorId;
    }

    // If author name is not provided, use the current authenticated user's name
    if (!req.body.author) {
      const authorId = req.user.userId;
      const authorUser = await User.findById(authorId);
      if (authorUser) {
        req.body.author = authorUser.name || authorUser.username;
      }
    }

    const updatedPost = await blogService.updateBlog(id, req.body);
    if (!updatedPost) {
      return res.status(404).json({ message: 'Blog post not found', success: false, error: true });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error in updateBlogPost:", error);
    res.status(500).json({ message: 'Error updating blog post', success: false, error: true });
  }
}

async function deleteBlogPost(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid blog post ID', success: false, error: true });
    }
    const deletedPost = await blogService.deleteBlogPostService(id);
    if (!deletedPost) {
      return res.status(404).json({ message: 'Blog post not found', success: false, error: true });
    }
    res.status(200).json({ message: 'Blog post deleted successfully', success: true, error: false });
  } catch (error) {
    console.error("Error in deleteBlogPost:", error);
    res.status(500).json({ message: 'Error deleting blog post', success: false, error: true });
  }
}

module.exports = {
  getAllAdminBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
};
