/**
 * Blog Controller Tests
 * Tests blog functionality including CRUD operations
 */

import request from 'supertest';
import mongoose from 'mongoose';
import testApp from '../testApp.js';
import Blog from '../../models/Blog.js';
import User from '../../models/User.js';
import Location from '../../models/Location.js';
import Listing from '../../models/Listing.js';
import {
  createTestUser,
  createTestListing,
  cleanupTestData,
} from '../helpers/testHelpers.js';

describe('Blog Controller', () => {
  let testUser: any;
  let testToken: string;
  let testLocation: any;
  let testListing: any;

  beforeEach(async () => {
    await cleanupTestData();

    // Create test user
    const userData = await createTestUser({
      userName: 'bloguser',
      firstName: 'Blog',
      lastName: 'User',
      role: 'Host',
    });
    testUser = userData.user;
    testToken = userData.token;
    testLocation = userData.location;

    // Create test listing
    testListing = await createTestListing(testUser._id, testLocation._id);
  });

  afterAll(async () => {
    await cleanupTestData();
  });

  describe('GET /api/blogs - getAllBlogs', () => {
    it('should return all blogs with populated user data', async () => {
      // Create test blogs
      const blog1 = await Blog.create({
        userId: testUser._id,
        blogTitle: 'First Blog',
        blogContent: 'This is the first blog content',
        photos: ['https://example.com/photo1.jpg'],
        listingId: testListing._id,
      });

      const blog2 = await Blog.create({
        userId: testUser._id,
        blogTitle: 'Second Blog',
        blogContent: 'This is the second blog content',
        photos: [],
      });

      const response = await request(testApp).get('/api/blogs').expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].blogTitle).toBe('Second Blog'); // Should be sorted by createdAt desc
      expect(response.body[1].blogTitle).toBe('First Blog');

      // Check if user data is populated
      expect(response.body[0].userId).toHaveProperty('userName');
      expect(response.body[0].userId).toHaveProperty('firstName');
      expect(response.body[0].userId).toHaveProperty('lastName');
      expect(response.body[0].userId).toHaveProperty('avatar');
    });

    it('should return empty array when no blogs exist', async () => {
      const response = await request(testApp).get('/api/blogs').expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should handle server errors gracefully', async () => {
      // Mock Blog.find to throw an error
      jest.spyOn(Blog, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp).get('/api/blogs').expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch blogs');
    });
  });

  describe('GET /api/blogs/user/:userId - getBlogsByUserId', () => {
    it('should return blogs for a specific user', async () => {
      // Create another user
      const user2Data = await createTestUser({
        userName: 'bloguser2',
        firstName: 'Blog2',
        lastName: 'User2',
      });

      // Create blogs for both users
      await Blog.create({
        userId: testUser._id,
        blogTitle: 'User 1 Blog',
        blogContent: 'Content from user 1',
      });

      await Blog.create({
        userId: user2Data.user._id,
        blogTitle: 'User 2 Blog',
        blogContent: 'Content from user 2',
      });

      const response = await request(testApp)
        .get(`/api/blogs/user/${testUser._id}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].blogTitle).toBe('User 1 Blog');
      expect(response.body[0].userId._id).toBe(testUser._id.toString());
    });

    it('should return empty array for user with no blogs', async () => {
      const user2Data = await createTestUser({
        userName: 'nobloguser',
        firstName: 'No',
        lastName: 'Blogs',
      });

      const response = await request(testApp)
        .get(`/api/blogs/user/${user2Data.user._id}`)
        .expect(200);

      expect(response.body).toHaveLength(0);
    });

    it('should return 400 for invalid user ID format', async () => {
      const response = await request(testApp)
        .get('/api/blogs/user/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Blog, 'find').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp)
        .get(`/api/blogs/user/${testUser._id}`)
        .expect(500);

      expect(response.body).toHaveProperty(
        'error',
        'Failed to fetch user blogs',
      );
    });
  });

  describe('POST /api/blogs - createBlog', () => {
    it('should create a new blog with all fields', async () => {
      const blogData = {
        userId: testUser._id,
        blogTitle: 'New Blog Post',
        blogContent: 'This is a great blog post about dining',
        photos: [
          'https://example.com/photo1.jpg',
          'https://example.com/photo2.jpg',
        ],
        listingId: testListing._id,
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(201);

      expect(response.body).toHaveProperty('_id');
      expect(response.body.blogTitle).toBe(blogData.blogTitle);
      expect(response.body.blogContent).toBe(blogData.blogContent);
      expect(response.body.photos).toEqual(blogData.photos);
      expect(response.body.listingId).toBe(testListing._id.toString());
      expect(response.body.userId).toHaveProperty('userName');

      // Verify blog was saved to database
      const savedBlog = await Blog.findById(response.body._id);
      expect(savedBlog).toBeTruthy();
      expect(savedBlog!.blogTitle).toBe(blogData.blogTitle);
    });

    it('should create a blog with minimal required fields', async () => {
      const blogData = {
        userId: testUser._id,
        blogTitle: 'Minimal Blog',
        blogContent: 'Just the basics',
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(201);

      expect(response.body.blogTitle).toBe(blogData.blogTitle);
      expect(response.body.blogContent).toBe(blogData.blogContent);
      expect(response.body.photos).toEqual([]);
      expect(response.body.listingId).toBeNull();
    });

    it('should return 400 when userId is missing', async () => {
      const blogData = {
        blogTitle: 'Missing User',
        blogContent: 'This blog has no user',
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'UserId, blogTitle, and blogContent are required',
      );
    });

    it('should return 400 when blogTitle is missing', async () => {
      const blogData = {
        userId: testUser._id,
        blogContent: 'This blog has no title',
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'UserId, blogTitle, and blogContent are required',
      );
    });

    it('should return 400 when blogContent is missing', async () => {
      const blogData = {
        userId: testUser._id,
        blogTitle: 'No Content Blog',
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'UserId, blogTitle, and blogContent are required',
      );
    });

    it('should return 400 for invalid userId format', async () => {
      const blogData = {
        userId: 'invalid-id',
        blogTitle: 'Invalid User',
        blogContent: 'This has invalid user ID',
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid user ID format');
    });

    it('should return 400 for invalid listingId format', async () => {
      const blogData = {
        userId: testUser._id,
        blogTitle: 'Invalid Listing',
        blogContent: 'This has invalid listing ID',
        listingId: 'invalid-listing-id',
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Invalid listing ID format',
      );
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Blog.prototype, 'save').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const blogData = {
        userId: testUser._id,
        blogTitle: 'Error Blog',
        blogContent: 'This will cause an error',
      };

      const response = await request(testApp)
        .post('/api/blogs')
        .send(blogData)
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to create blog');
    });
  });

  describe('PUT /api/blogs/:id - updateBlog', () => {
    let testBlog: any;

    beforeEach(async () => {
      testBlog = await Blog.create({
        userId: testUser._id,
        blogTitle: 'Original Title',
        blogContent: 'Original content',
        photos: ['https://example.com/original.jpg'],
        listingId: testListing._id,
      });
    });

    it('should update blog with all fields', async () => {
      const updateData = {
        blogTitle: 'Updated Title',
        blogContent: 'Updated content',
        photos: [
          'https://example.com/updated1.jpg',
          'https://example.com/updated2.jpg',
        ],
        listingId: null,
      };

      const response = await request(testApp)
        .put(`/api/blogs/${testBlog._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.blogTitle).toBe(updateData.blogTitle);
      expect(response.body.blogContent).toBe(updateData.blogContent);
      expect(response.body.photos).toEqual(updateData.photos);
      expect(response.body.listingId).toBeNull();

      // Verify in database
      const updatedBlog = await Blog.findById(testBlog._id);
      expect(updatedBlog!.blogTitle).toBe(updateData.blogTitle);
    });

    it('should update only blogTitle', async () => {
      const updateData = {
        blogTitle: 'Only Title Updated',
      };

      const response = await request(testApp)
        .put(`/api/blogs/${testBlog._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.blogTitle).toBe(updateData.blogTitle);
      expect(response.body.blogContent).toBe('Original content'); // Should remain unchanged
    });

    it('should update only blogContent', async () => {
      const updateData = {
        blogContent: 'Only content updated',
      };

      const response = await request(testApp)
        .put(`/api/blogs/${testBlog._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.blogContent).toBe(updateData.blogContent);
      expect(response.body.blogTitle).toBe('Original Title'); // Should remain unchanged
    });

    it('should return 400 for invalid blog ID format', async () => {
      const response = await request(testApp)
        .put('/api/blogs/invalid-id')
        .send({ blogTitle: 'Updated' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid blog ID format');
    });

    it('should return 400 when no update fields provided', async () => {
      const response = await request(testApp)
        .put(`/api/blogs/${testBlog._id}`)
        .send({})
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'At least one of blogTitle, blogContent, photos, or listingId must be provided',
      );
    });

    it('should return 404 for non-existent blog', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(testApp)
        .put(`/api/blogs/${nonExistentId}`)
        .send({ blogTitle: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Blog not found');
    });

    it('should return 400 for invalid listingId format', async () => {
      const updateData = {
        listingId: 'invalid-listing-id',
      };

      const response = await request(testApp)
        .put(`/api/blogs/${testBlog._id}`)
        .send(updateData)
        .expect(400);

      expect(response.body).toHaveProperty(
        'error',
        'Invalid listing ID format',
      );
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Blog, 'findById').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp)
        .put(`/api/blogs/${testBlog._id}`)
        .send({ blogTitle: 'Error Update' })
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to update blog');
    });
  });

  describe('DELETE /api/blogs/:id - deleteBlog', () => {
    let testBlog: any;

    beforeEach(async () => {
      testBlog = await Blog.create({
        userId: testUser._id,
        blogTitle: 'Blog to Delete',
        blogContent: 'This blog will be deleted',
      });
    });

    it('should delete an existing blog', async () => {
      const response = await request(testApp)
        .delete(`/api/blogs/${testBlog._id}`)
        .expect(200);

      expect(response.body).toHaveProperty(
        'message',
        'Blog deleted successfully',
      );

      // Verify blog was deleted from database
      const deletedBlog = await Blog.findById(testBlog._id);
      expect(deletedBlog).toBeNull();
    });

    it('should return 400 for invalid blog ID format', async () => {
      const response = await request(testApp)
        .delete('/api/blogs/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid blog ID format');
    });

    it('should return 404 for non-existent blog', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(testApp)
        .delete(`/api/blogs/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Blog not found');
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Blog, 'findById').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp)
        .delete(`/api/blogs/${testBlog._id}`)
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to delete blog');
    });
  });

  describe('GET /api/blogs/:id - getBlogById', () => {
    let testBlog: any;

    beforeEach(async () => {
      testBlog = await Blog.create({
        userId: testUser._id,
        blogTitle: 'Single Blog',
        blogContent: 'Content for single blog',
        photos: ['https://example.com/single.jpg'],
        listingId: testListing._id,
      });
    });

    it('should return a specific blog by ID with populated data', async () => {
      const response = await request(testApp)
        .get(`/api/blogs/${testBlog._id}`)
        .expect(200);

      expect(response.body._id).toBe(testBlog._id.toString());
      expect(response.body.blogTitle).toBe('Single Blog');
      expect(response.body.blogContent).toBe('Content for single blog');
      expect(response.body.photos).toEqual(['https://example.com/single.jpg']);

      // Check if user data is populated
      expect(response.body.userId).toHaveProperty('userName');
      expect(response.body.userId).toHaveProperty('firstName');
      expect(response.body.userId).toHaveProperty('lastName');
      expect(response.body.userId).toHaveProperty('avatar');

      // Check if listing data is populated
      expect(response.body.listingId).toHaveProperty('title');
    });

    it('should return 400 for invalid blog ID format', async () => {
      const response = await request(testApp)
        .get('/api/blogs/invalid-id')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Invalid blog ID format');
    });

    it('should return 404 for non-existent blog', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(testApp)
        .get(`/api/blogs/${nonExistentId}`)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Blog not found');
    });

    it('should handle server errors gracefully', async () => {
      jest.spyOn(Blog, 'findById').mockImplementationOnce(() => {
        throw new Error('Database error');
      });

      const response = await request(testApp)
        .get(`/api/blogs/${testBlog._id}`)
        .expect(500);

      expect(response.body).toHaveProperty('error', 'Failed to fetch blog');
    });
  });

  // Clean up mocks after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });
});
