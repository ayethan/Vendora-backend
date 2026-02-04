const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  image: {
    type: String,
    default: '/img/default-blog.jpg', // Default image if none provided
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: false, // Now optional as it can be auto-generated
    maxlength: 300, // Short summary for listing
  },
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  category: {
    type: String, // Can be extended to ref another model if categories become complex
    trim: true,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

blogSchema.plugin(mongoosePaginate);

blogSchema.pre('validate', function(next) {
  // Auto-generate slug from title
  if (this.isModified('title') && this.title) {
    this.slug = this.title.toLowerCase()
      .replace(/<[^>]*>?/gm, '')      // Strip HTML tags
      .replace(/[^a-z0-9\s-]/g, '')   // Remove non-alphanumeric chars except spaces and hyphens
      .replace(/\s+/g, '-')            // Replace spaces with hyphens
      .replace(/^-+|-+$/g, '');         // Trim hyphens from start/end
  }

  // Auto-generate excerpt from content if not provided
  if (this.isModified('content') && this.content && !this.excerpt) {
    const strippedContent = this.content.replace(/<[^>]*>?/gm, ''); // Strip HTML tags for a clean excerpt
    this.excerpt = strippedContent.substring(0, 150) + (strippedContent.length > 150 ? '...' : '');
  }

  next();
});

module.exports = mongoose.model('Blog', blogSchema);
