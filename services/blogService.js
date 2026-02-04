const Blog = require('../models/blogModel');
const mongoose = require('mongoose');

async function getAllBlogPostsService(page = 1, limit = 10, category = '', tag = '', search = '') {
  const query = { isPublished: false };

  if (category) {
    query.category = category;
  }

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    select: '-content', // Frontend might not need full content in list view
  };
  const result = await Blog.paginate(query, options);
  console.log('Result:', result);
  return result;
}

async function getBlogPostBySlugService(slug) {
  const post = await Blog.findOne({ slug, isPublished: false });
  return post;
}

// Admin-specific functions
async function getBlog(page = 1, limit = 10, search = '') {
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
  }

  const options = {
    page: parseInt(page),
    limit: parseInt(limit),
    sort: { createdAt: -1 },
    // select: '-content', // Admin might need full content for list, or fetch on demand
  };

  // const result = await Blog.paginate(query, options);
  const result = await Blog.paginate(options);
  return result;
}

async function createBlog(blogData) {
  const newPost = new Blog(blogData);
  await newPost.save();
  return newPost;
}

async function getBlogById(id) {
  const post = await Blog.findById(id); // No isPublished filter
  return post;
}

async function updateBlog(id, blogData) {
  const updatedPost = await Blog.findByIdAndUpdate(id, blogData, { new: true, runValidators: true });
  return updatedPost;
}

async function deleteBlog(id) {
  const deletedPost = await Blog.findByIdAndDelete(id);
  return deletedPost;
}

module.exports = {
  getAllBlogPostsService,
  getBlogPostBySlugService,
  getBlog,
  createBlog,
  getBlogById,
  updateBlog,
  deleteBlog,
};
