const url = require('url');
const MongoClient = require('mongodb').MongoClient;

let cachedDb = null;

async function connectToDatabase(uri) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await MongoClient.connect(uri, { useNewUrlParser: true });
    const db = await client.db(url.parse(uri).pathname.substr(1));

    cachedDb = db;
    return db;
}

exports.handler = async function (event, context, callback) {
    const db = await connectToDatabase(process.env.MONGODB_URI);
    const collection = await db.collection('therms');
    const therms = await collection.find({}).toArray();

    return {
        statusCode: 200,
        body: JSON.stringify(therms)
    };
}