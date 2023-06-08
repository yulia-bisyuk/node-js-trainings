// const mongodb = require('mongodb');
const { MongoClient } = require('mongodb');

const uri =
  'mongodb+srv://yuliabisyuk:Vhnr5LTEvWaxcne4@cluster0.exx11wp.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri);

const mongoConnect = (callback) => {
  client
    .connect()
    .then((client) => {
      callback(client);
      console.log('Connected');
    })
    .catch((err) => console.log(err));
};

module.exports = mongoConnect;
