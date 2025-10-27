import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const migrateDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    const baseUri = 'mongodb+srv://cosmicrocketadventure_db_user:wG1WagcgBZlEfQqe@makben.8jlt673.mongodb.net';
    
    // Connect to test database
    const testConn = await mongoose.createConnection(`${baseUri}/test?retryWrites=true&w=majority`).asPromise();
    console.log('✅ Connected to test database');
    
    // Connect to makben-portfolio database
    const prodConn = await mongoose.createConnection(`${baseUri}/makben-portfolio?retryWrites=true&w=majority`).asPromise();
    console.log('✅ Connected to makben-portfolio database');
    
    // Get collections from test database
    const collections = ['achievements', 'experiences', 'profiles', 'projects', 'services', 'skills', 'videos'];
    
    for (const collectionName of collections) {
      try {
        const sourceCollection = testConn.collection(collectionName);
        const destCollection = prodConn.collection(collectionName);
        
        // Get all documents from source
        const docs = await sourceCollection.find({}).toArray();
        
        if (docs.length > 0) {
          // Insert into destination
          await destCollection.insertMany(docs);
          console.log(`✅ Migrated ${docs.length} documents from test.${collectionName} to makben-portfolio.${collectionName}`);
        } else {
          console.log(`ℹ️  No documents in test.${collectionName}`);
        }
      } catch (error: any) {
        if (error.code === 11000) {
          console.log(`ℹ️  ${collectionName} already exists in makben-portfolio, skipping...`);
        } else {
          console.error(`❌ Error migrating ${collectionName}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Migration completed!');
    
    await testConn.close();
    await prodConn.close();
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    process.exit();
  }
};

migrateDatabase();
