/**
 * Listing Model Tests
 * Tests for the Listing model validation, creation, and database operations
 */
import { Types } from 'mongoose';
// Import models using require to avoid ESM issues
const ListingModel = require('../../models/Listing.ts').default;
const UserModel = require('../../models/User.ts').default;
const LocationModel = require('../../models/Location.ts').default;
describe('Listing Model Tests', () => {
    let testUserId;
    let testLocationId;
    let validListingData; // Will be defined after setup
    // Create test user and location before all tests
    beforeAll(async () => {
        // Create a test user
        const testUser = new UserModel({
            userName: 'test_listing_user',
            firstName: 'Test',
            lastName: 'User',
            phone: '+1234567890',
            password: 'hashedpassword',
            cover: 'https://example.com/cover.jpg',
            locationId: new Types.ObjectId(),
        });
        const savedUser = await testUser.save();
        testUserId = savedUser._id;
        // Create a test location
        const testLocation = new LocationModel({
            city: 'Test City',
            country: 'USA',
        });
        const savedLocation = await testLocation.save();
        testLocationId = savedLocation._id;
        // Now define the valid listing data
        validListingData = {
            userId: testUserId,
            title: 'Amazing Italian Dinner Experience',
            description: 'Join me for an authentic Italian dinner in my cozy home kitchen',
            category: 'dining',
            locationId: testLocationId,
            images: [
                'https://example.com/image1.jpg',
                'https://example.com/image2.jpg',
            ],
            time: new Date('2024-12-25T18:00:00Z'),
            duration: 180, // 3 hours in minutes
            numGuests: 4,
            cuisine: ['Italian', 'Mediterranean'],
            dietary: ['vegetarian-friendly'],
            interestTopic: ['cooking', 'culture'],
            additionalInfo: 'Please bring your appetite!',
        };
    });
    afterAll(async () => {
        // Clean up test data
        await UserModel.deleteOne({ _id: testUserId });
        await LocationModel.deleteOne({ _id: testLocationId });
        await ListingModel.deleteMany({ userId: testUserId });
    });
    describe('Listing Creation', () => {
        it('should create a new listing with valid data', async () => {
            const listing = new ListingModel(validListingData);
            const savedListing = await listing.save();
            expect(savedListing._id).toBeDefined();
            expect(savedListing.userId.toString()).toBe(testUserId.toString());
            expect(savedListing.title).toBe(validListingData.title);
            expect(savedListing.description).toBe(validListingData.description);
            expect(savedListing.category).toBe(validListingData.category);
            expect(savedListing.locationId.toString()).toBe(testLocationId.toString());
            expect(savedListing.status).toBe('waiting'); // Default value
            expect(savedListing.numGuests).toBe(4);
            expect(savedListing.cuisine).toEqual(['Italian', 'Mediterranean']);
            expect(savedListing.createdAt).toBeDefined();
        });
        it('should create a listing with minimal required data', async () => {
            const minimalData = {
                userId: testUserId,
                title: 'Simple Event',
                description: 'A basic event listing',
                category: 'event',
                locationId: testLocationId,
            };
            const listing = new ListingModel(minimalData);
            const savedListing = await listing.save();
            expect(savedListing.title).toBe('Simple Event');
            expect(savedListing.category).toBe('event');
            expect(savedListing.status).toBe('waiting'); // Default
            expect(savedListing.numGuests).toBe(1); // Default
            expect(savedListing.images).toEqual([]); // Default empty array
            expect(savedListing.cuisine).toEqual([]); // Default empty array
        });
        it('should handle all category types', async () => {
            const categories = ['dining', 'travel', 'event'];
            for (const category of categories) {
                const listing = new ListingModel({
                    userId: testUserId,
                    title: `Test ${category} listing`,
                    description: `A test ${category} experience`,
                    category,
                    locationId: testLocationId,
                });
                const savedListing = await listing.save();
                expect(savedListing.category).toBe(category);
            }
        });
    });
    describe('Listing Validation', () => {
        it('should require userId', async () => {
            const invalidData = {
                title: 'Test Listing',
                description: 'Test description',
                category: 'dining',
                locationId: testLocationId,
                // Missing userId
            };
            const listing = new ListingModel(invalidData);
            await expect(listing.save()).rejects.toThrow(/required/);
        });
        it('should require title', async () => {
            const invalidData = {
                userId: testUserId,
                description: 'Test description',
                category: 'dining',
                locationId: testLocationId,
                // Missing title
            };
            const listing = new ListingModel(invalidData);
            await expect(listing.save()).rejects.toThrow(/required/);
        });
        it('should require description', async () => {
            const invalidData = {
                userId: testUserId,
                title: 'Test Listing',
                category: 'dining',
                locationId: testLocationId,
                // Missing description
            };
            const listing = new ListingModel(invalidData);
            await expect(listing.save()).rejects.toThrow(/required/);
        });
        it('should validate category enum values', async () => {
            const invalidData = {
                userId: testUserId,
                title: 'Test Listing',
                description: 'Test description',
                category: 'invalid_category', // Invalid enum value
                locationId: testLocationId,
            };
            const listing = new ListingModel(invalidData);
            await expect(listing.save()).rejects.toThrow(/enum/);
        });
        it('should validate status enum values', async () => {
            const listing = new ListingModel({
                userId: testUserId,
                title: 'Test Listing',
                description: 'Test description',
                category: 'dining',
                locationId: testLocationId,
                status: 'invalid_status', // Invalid enum value
            });
            await expect(listing.save()).rejects.toThrow(/enum/);
        });
        it('should trim whitespace from string fields', async () => {
            const dataWithWhitespace = {
                userId: testUserId,
                title: '  Spaced Title  ',
                description: '  Spaced Description  ',
                category: 'dining',
                locationId: testLocationId,
                additionalInfo: '  Extra Info  ',
            };
            const listing = new ListingModel(dataWithWhitespace);
            const savedListing = await listing.save();
            expect(savedListing.title).toBe('Spaced Title');
            expect(savedListing.description).toBe('Spaced Description');
            expect(savedListing.additionalInfo).toBe('Extra Info');
        });
    });
    describe('Listing Queries', () => {
        beforeEach(async () => {
            // Clean up any existing test data
            await ListingModel.deleteMany({ title: /^Query Test/ });
            // Create test listings
            const testListings = [
                {
                    ...validListingData,
                    title: 'Query Test Dining 1',
                    category: 'dining',
                    status: 'approved',
                    cuisine: ['Italian'],
                },
                {
                    ...validListingData,
                    title: 'Query Test Travel 1',
                    category: 'travel',
                    status: 'pending',
                    interestTopic: ['adventure'],
                },
                {
                    ...validListingData,
                    title: 'Query Test Event 1',
                    category: 'event',
                    status: 'waiting',
                    numGuests: 8,
                },
            ];
            await ListingModel.insertMany(testListings);
        });
        afterEach(async () => {
            await ListingModel.deleteMany({ title: /^Query Test/ });
        });
        it('should find listings by category', async () => {
            const diningListings = await ListingModel.find({ category: 'dining' });
            const travelListings = await ListingModel.find({ category: 'travel' });
            expect(diningListings.length).toBeGreaterThanOrEqual(1);
            expect(travelListings.length).toBeGreaterThanOrEqual(1);
            diningListings.forEach((listing) => {
                expect(listing.category).toBe('dining');
            });
        });
        it('should find listings by status', async () => {
            const approvedListings = await ListingModel.find({ status: 'approved' });
            const pendingListings = await ListingModel.find({ status: 'pending' });
            expect(approvedListings.length).toBeGreaterThanOrEqual(1);
            expect(pendingListings.length).toBeGreaterThanOrEqual(1);
        });
        it('should find listings by user', async () => {
            const userListings = await ListingModel.find({ userId: testUserId });
            expect(userListings.length).toBeGreaterThanOrEqual(3);
            userListings.forEach((listing) => {
                expect(listing.userId.toString()).toBe(testUserId.toString());
            });
        });
        it('should find listings by cuisine', async () => {
            const italianListings = await ListingModel.find({
                cuisine: { $in: ['Italian'] },
            });
            expect(italianListings.length).toBeGreaterThanOrEqual(1);
            italianListings.forEach((listing) => {
                expect(listing.cuisine).toContain('Italian');
            });
        });
        it('should find listings by number of guests', async () => {
            const largeGroupListings = await ListingModel.find({
                numGuests: { $gte: 6 },
            });
            expect(largeGroupListings.length).toBeGreaterThanOrEqual(1);
            largeGroupListings.forEach((listing) => {
                expect(listing.numGuests).toBeGreaterThanOrEqual(6);
            });
        });
    });
    describe('Listing Updates', () => {
        it('should update listing status', async () => {
            const listing = new ListingModel({
                userId: testUserId,
                title: 'Update Test Listing',
                description: 'Test description',
                category: 'dining',
                locationId: testLocationId,
                status: 'waiting',
            });
            const savedListing = await listing.save();
            expect(savedListing.status).toBe('waiting');
            // Update status
            savedListing.status = 'approved';
            // Small delay to ensure timestamp difference
            await new Promise((resolve) => setTimeout(resolve, 10));
            const updatedListing = await savedListing.save();
            expect(updatedListing.status).toBe('approved');
            expect(updatedListing.updatedAt.getTime()).toBeGreaterThan(updatedListing.createdAt.getTime());
        });
        it('should update listing details', async () => {
            const listing = new ListingModel({
                userId: testUserId,
                title: 'Original Title',
                description: 'Original description',
                category: 'event',
                locationId: testLocationId,
                numGuests: 2,
            });
            const savedListing = await listing.save();
            // Update multiple fields
            savedListing.title = 'Updated Title';
            savedListing.description = 'Updated description';
            savedListing.numGuests = 6;
            savedListing.additionalInfo = 'Added extra info';
            const updatedListing = await savedListing.save();
            expect(updatedListing.title).toBe('Updated Title');
            expect(updatedListing.description).toBe('Updated description');
            expect(updatedListing.numGuests).toBe(6);
            expect(updatedListing.additionalInfo).toBe('Added extra info');
        });
    });
});
