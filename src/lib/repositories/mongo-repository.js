class MongoRepository {
  constructor(database, collectionName) {
    this._database = database;
    this._collectionName = collectionName;
  }

  get Collection() {
    return this._database.collection(this._collectionName);
  }

  aggregate(pipeline) {
    return this.aggregateCursor(pipeline).toArray();
  }
  aggregateCursor(pipeline) {
    return this.Collection.aggregate(pipeline);
  }

  bulkWrite(operations) {
    return this.Collection.bulkWrite(operations);
  }

  async deleteOne(filter) {
    const { deletedCount } = this.Collection.deleteOne(filter);
    return deletedCount;
  }

  async deleteMany(filter) {
    const { deletedCount } = this.Collection.deleteMany(filter);
    return deletedCount;
  }

  get(query, projection = {}) {
    return this.Collection.getCursor(query, projection).toArray();
  }
  getCursor(query, projection = {}) {
    return this.Collection.find(query, { projection });
  }

  getOne(query, projection = {}) {
    return this.Collection.findOne(query, { projection });
  }

  getCount(query) {
    return this.Collection.count(query);
  }

  getById(id, projection = {}) {
    return this.getOne({ _id: id }, projection);
  }

  async insertOne(document) {
    const { insertedId } = this.Collection.insertOne(document);
    return insertedId;
  }

  async insertMany(documents) {
    const { insertedIds } = this.Collection.insertMany(documents);
    return insertedIds;
  }

  async replaceOne(filter, document) {
    const { modifiedCount } = this.Collection.replaceOne(filter, document);
    return modifiedCount;
  }

  async updateOne(filter, updates) {
    const { modifiedCount } = this.Collection.updateOne(filter, updates);
    return modifiedCount;
  }

  async updateMany(filter, updates) {
    const { modifiedCount } = this.Collection.updateMany(filter, updates);
    return modifiedCount;
  }
}

export default MongoRepository;
