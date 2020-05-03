class MysqlRepository {
  constructor(connection, tableName) {
    this._connection = connection;
    this._tableName = tableName;
  }

  get Connection() {
    return this._connection;
  }

  get table() {
    return this._tableName;
  }

  findAll() {
    return new Promise((resolve, reject) => {
      this.Connection.query("select * from ??", [this.table], (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  }
}

export default MysqlRepository;
