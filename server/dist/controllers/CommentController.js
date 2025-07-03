import Comment from '../models/Comment.js';
import Blog from '../models/Blog.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
// Create a new comment
export const createComment = async (req, res) => {
    try {
        const { blogId, userId, content } = req.body;
        // Validate required fields
        if (!blogId || !userId || !content) {
            res
                .status(400)
                .json({ error: 'blogId, userId and content are required' });
            return;
        }
        // Validate MongoDB ObjectIds
        if (!mongoose.Types.ObjectId.isValid(blogId) ||
            !mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ error: 'Invalid blogId or userId format' });
            return;
        }
        // Get the blog and its author
        const blog = await Blog.findById(blogId).populate('userId', 'userName firstName lastName');
        if (!blog) {
            res.status(404).json({ error: 'Blog not found' });
            return;
        }
        // Get the commenter information
        const commenter = await User.findById(userId).select('userName firstName lastName');
        if (!commenter) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        // Create new comment
        const newComment = new Comment({
            blogId,
            userId,
            content,
        });
        await newComment.save();
        // Update comment count in blog
        await Blog.findByIdAndUpdate(blogId, { $inc: { comments: 1 } });
        // Create notification for blog author (only if commenter is not the author)
        if (blog.userId._id.toString() !== userId.toString()) {
            const notification = new Notification({
                recipientId: blog.userId._id,
                senderId: userId,
                type: 'comment',
                message: `${commenter.userName || commenter.firstName} commented on your blog: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
                blogId: blogId,
                blogTitle: blog.blogTitle,
            });
            await notification.save();
            // Emit real-time notification via Socket.IO
            const io = req.app.get('io');
            if (io) {
                const populatedNotification = await Notification.findById(notification._id)
                    .populate('senderId', 'userName firstName lastName avatar')
                    .populate('blogId', 'blogTitle');
                if (populatedNotification) {
                    io.to(`user_${blog.userId._id}`).emit('new_notification', {
                        _id: populatedNotification._id,
                        type: 'comment',
                        message: populatedNotification.message,
                        senderId: populatedNotification.senderId,
                        blogId: populatedNotification.blogId,
                        blogTitle: populatedNotification.blogTitle,
                        isRead: false,
                        createdAt: populatedNotification.createdAt,
                    });
                }
            }
        }
        // Populate user data before returning
        const populatedComment = await Comment.findById(newComment._id).populate('userId', 'userName firstName lastName avatar');
        res.status(201).json(populatedComment);
    }
    catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Failed to create comment' });
    }
};
// Get comments for a blog
export const getCommentsByBlogId = async (req, res) => {
    try {
        const { blogId } = req.params;
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            res.status(400).json({ error: 'Invalid blog ID format' });
        }
        // Get comments
        const comments = await Comment.find({ blogId })
            .populate('userId', 'userName firstName lastName avatar')
            .sort({ createdAt: -1 });
        res.status(200).json(comments);
    }
    catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
};
