import * as HttpStatus from '../../common/lib/httpStatusCodes';
import ApiController from './apiController';

class RepositoryOfTController extends ApiController {
  constructor (repositoryOfT) {
    super();
    this._repositoryOfT = repositoryOfT;
  }

  get Repository () {
    return this._repositoryOfT;
  }

  async get (req, res) {
    try {
      const entities = await this.Repository.get(req.query);
      res.json(entities);
    } catch (err) {
      res.status(HttpStatus.InternalServerError).json(err);
    }
  }

  getById (req, res) {
    res.json(req._entity);
  }

  async post (req, res) {
    const newEntity = new this.Repository.Model(req.body);
    try {
      await this.Repository.create(newEntity);
      res.status(HttpStatus.Created).json(newEntity);
    } catch (err) {
      res.status(HttpStatus.InternalServerError).json(err);
    }
  }

  async put (req, res) {
    try {
      const updatedEntity = await this.Repository.update(req._entity, req.body);
      res.json(updatedEntity);
    } catch (err) {
      res.status(HttpStatus.InternalServerError).json(err);
    }
  }

  async upsert (req, res) {
    try {
      const updatedEntity = await this.Repository.update(req._entity, req.body, { upsert: true });
      res.json(updatedEntity);
    } catch (err) {
      res.status(HttpStatus.InternalServerError).json(err);
    }
  }

  async patch (req, res) {
    try {
      const updatedEntity = await this.Repository.patch(req._entity, req.body);
      res.json(updatedEntity);
    } catch (err) {
      res.status(HttpStatus.InternalServerError).json(err);
    }
  }

  async remove (req, res) {
    try {
      await this.Repository.remove(req._entity);
      res.status(HttpStatus.NoContent).send('Deleted');
    } catch (err) {
      res.status(HttpStatus.InternalServerError).json(err);
    }
  }

  async search (req, res) {
    let query = this.Repository._get(req.body);
    if (req.query && req.query.orderBy) {
      query = query.sort(
        (
          Array.isArray(req.query.orderBy)
            ? req.query.orderBy
            : [req.query.orderBy]
        ).reduce(
          (acc, prop) => (prop[0] === '-')
            ? Object.assign({}, acc, {
              [prop.slice(1)]: -1
            })
            : Object.assign({}, acc, {
              [prop]: 1
            })
          , {})
      );
    }
    res.json(await query);
  }
}

export default RepositoryOfTController;