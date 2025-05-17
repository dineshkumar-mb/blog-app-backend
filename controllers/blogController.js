const Blog = require('../models/Blog');
const User = require('../models/User');

// Get all blogs with optional filters
exports.getAllBlogs = async (req, res) => {
  try {
    const { category, author } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (author) filter.author = author;

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new blog
exports.createBlog = async (req, res) => {
  try {
    const { title, category, content, image } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const newBlog = new Blog({
      title,
      category,
      content,
      image,
      author: user.name,
      userId: user._id,
      createdAt: new Date()
    });

    await newBlog.save();
    res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a blog
exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a blog
exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    if (blog.userId.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    await Blog.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Blog deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
