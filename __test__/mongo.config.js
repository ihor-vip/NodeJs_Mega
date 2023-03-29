const { MongoMemoryServer } = require('mongodb-memory-server');
const { mongoose } = require('Share/dependencies');

const mongodb = new MongoMemoryServer({});

module.exports = {
  connect: async () => {
    const testUri = await mongodb.getUri();

    await mongoose.connect(testUri)
  },

  disconnect: async () => {
    mongoose.connection.dropDatabase();
    mongoose.connection.close();

    await mongodb.stop();
  },


  clearDb: async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  }
}
