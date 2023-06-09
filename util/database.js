const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://yuliabisyuk:Vhnr5LTEvWaxcne4@cluster0.exx11wp.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

let db;

const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      db = client.db('shop');
      callback();
      console.log('Connected');
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (db) {
    return db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
