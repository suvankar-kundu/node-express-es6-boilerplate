class MysqlRepository {
  constructor(connection, tableName) {
    this._connection = connection;
    this._tableName = tableName;
  }

  get Connection() {
    return this._connection;
  }

  get Table() {
    return this._tableName;
  }

  get() {
    return new Promise((resolve, reject) => {
      this.Connection.query("select * from ??", [this.Table], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }

  insertOne(document) {
    return new Promise((resolve, reject) => {
      this.Connection.query(
        "INSERT INTO ?? SET ?",
        [this.Table, document],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(Object.assign({}, document, { id: res.insertId }));
          }
        }
      );
    });
  }

  getById(id) {
    return new Promise((resolve, reject) => {
      this.Connection.query(
        "SELECT * FROM ?? WHERE id = ?",
        [this.Table, id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            if (res.length) {
              resolve(res[0]);
            }
            resolve(null);
          }
        }
      );
    });
  }

  updateOne(document, id) {
    return new Promise((resolve, reject) => {
      this.Connection.query(
        "UPDATE ?? SET ? WHERE id = ?",
        [this.Table, document, id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.affectedRows);
          }
        }
      );
    });
  }
  deleteOne(id) {
    return new Promise((resolve, reject) => {
      this.Connection.query(
        "DELETE FROM ?? WHERE id = ?",
        [this.Table, id],
        (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res.affectedRows);
          }
        }
      );
    });
  }

  rawQuery(sql, bindParam) {
    return new Promise((resolve, reject) => {
      this.Connection.query(sql, bindParam, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export default MysqlRepository;
