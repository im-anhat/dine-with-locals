import mongoose from 'mongoose';

// Script to fix the Match collection index issue
async function fixMatchIndexes() {
  try {
    console.log('Checking for old Match indexes...');

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not established');
    }

    const collection = db.collection('matches');

    // List all indexes
    const indexes = await collection.listIndexes().toArray();
    console.log(
      'Current indexes:',
      indexes.map((idx) => idx.name),
    );

    // Drop old time-based index if it exists
    for (const index of indexes) {
      if (index.name && index.name.includes('time')) {
        console.log(`Dropping old index: ${index.name}`);
        await collection.dropIndex(index.name);
        console.log(`Successfully dropped index: ${index.name}`);
      }
    }

    // Ensure correct index exists
    try {
      await collection.createIndex(
        { hostId: 1, guestId: 1, listingId: 1 },
        { unique: true, name: 'hostId_1_guestId_1_listingId_1' },
      );
      console.log(
        'Created correct unique index: hostId_1_guestId_1_listingId_1',
      );
    } catch (error: any) {
      if (error.code === 85) {
        console.log('Index already exists, skipping creation');
      } else {
        throw error;
      }
    }

    console.log('Match indexes fixed successfully!');
  } catch (error) {
    console.error('Error fixing Match indexes:', error);
    throw error;
  }
}

export { fixMatchIndexes };
