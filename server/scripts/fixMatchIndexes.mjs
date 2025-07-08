#!/usr/bin/env node

/**
 * Standalone script to fix Match collection indexes
 * Run this script to fix the duplicate key error in the matches collection
 *
 * Usage: node fixMatchIndexes.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

async function fixMatchIndexes() {
  try {
    console.log('🔧 Starting Match collection index fix...');

    // Connect to MongoDB
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://localhost:27017/dine-with-locals',
    );
    console.log(`✅ Connected to MongoDB: ${conn.connection.host}`);

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('matches');

    // List all current indexes
    console.log('📋 Checking current indexes...');
    const indexes = await collection.listIndexes().toArray();
    console.log(
      'Current indexes:',
      indexes.map((idx) => `${idx.name}: ${JSON.stringify(idx.key)}`),
    );

    // Drop old time-based index if it exists
    let droppedIndexes = 0;
    for (const index of indexes) {
      if (index.name && index.name.includes('time')) {
        console.log(`🗑️  Dropping old index: ${index.name}`);
        await collection.dropIndex(index.name);
        console.log(`✅ Successfully dropped index: ${index.name}`);
        droppedIndexes++;
      }
    }

    if (droppedIndexes === 0) {
      console.log('ℹ️  No old time-based indexes found to drop');
    }

    // Ensure correct index exists
    console.log('🔧 Creating correct unique index...');
    try {
      await collection.createIndex(
        { hostId: 1, guestId: 1, listingId: 1 },
        { unique: true, name: 'hostId_1_guestId_1_listingId_1' },
      );
      console.log(
        '✅ Created correct unique index: hostId_1_guestId_1_listingId_1',
      );
    } catch (error) {
      if (error.code === 85) {
        console.log('ℹ️  Correct index already exists, skipping creation');
      } else {
        throw error;
      }
    }

    // Show final index list
    console.log('📋 Final index list:');
    const finalIndexes = await collection.listIndexes().toArray();
    finalIndexes.forEach((idx) => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)}`);
    });

    console.log('🎉 Match indexes fixed successfully!');
    console.log('💡 You can now try creating bookings again.');
  } catch (error) {
    console.error('❌ Error fixing Match indexes:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixMatchIndexes()
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
