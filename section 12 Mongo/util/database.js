const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect('mongodb+srv://shahinbharthu:z13IccVxhHFrPzND@cluster0.fzsvc.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0')
    .then(client => {
      console.log('Mongodb connected');
      _db = client.db(); 
      callback()
    })
    .catch(err => {
      console.log(err);
      throw err;
    })
}

const getDb = () => {
  if (_db) {
    // console.log('_db exists with value: ', _db);
    return _db;
  }
  throw "No Database Found";
}

module.exports = {mongoConnect, getDb};