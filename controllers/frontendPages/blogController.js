const blogService = require('../../services/blogService');

async function getAllBlogPosts(req, res) {
  try {
    const { page, limit, category, tag, search } = req.query;
    const result = await blogService.getAllBlogPostsService(page, limit, category, tag, search);
    res.status(200).json({
      posts: result,
      totalPosts: result.totalDocs,
      totalPages: result.totalPages,
      currentPage: result.page,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
    });
  } catch (error) {
    console.error("Error in getAllBlogPosts:", error);
    res.status(500).json({ message: 'Error fetching blog posts', success: false, error: true });
  }
}

async function getBlogPostBySlug(req, res) {
  try {
    const { slug } = req.params;
    const post = await blogService.getBlogPostBySlugService(slug);
    if (!post) {
      return res.status(404).json({ message: 'Blog post not found', success: false, error: true });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getBlogPostBySlug:", error);
    res.status(500).json({ message: 'Error fetching blog post', success: false, error: true });
  }
}

module.exports = {
  getAllBlogPosts,
  getBlogPostBySlug,
};
