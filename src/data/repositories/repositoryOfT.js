class RepositoryOfT {
  constructor (model) {
    this._model = model;
  }

  get Model () {
    return this._model;
  }

  getAll (query) {
    throw new Error('Abstract method. Must be implemented before using.');
  }

  getById (id) {
    throw new Error('Abstract method. Must be implemented before using.');
  }

  create (entity) {
    throw new Error('Abstract method. Must be implemented before using.');
  }

  patch (changes) {
    throw new Error('Abstract method. Must be implemented before using.');
  }

  remove (entity) {
    throw new Error('Abstract method. Must be implemented before using.');
  }

  removeById (id, callback) {
    throw new Error('Abstract method. Must be implemented before using.');
  }
    
  update (entity) {
    throw new Error('Abstract method. Must be implemented before using.');
  }
}

export default RepositoryOfT;