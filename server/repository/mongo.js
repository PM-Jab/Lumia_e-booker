import { MongoClient, ObjectId } from "mongodb";

const url =
  "mongodb+srv://jab:KGbb1y5uXhNOv2BS@cluster0.7yl0b.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "lumia_test1"; // Replace with your database name

const client = new MongoClient(url);

async function connectToDatabase() {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    return db;
  } catch (error) {
    console.error("Error connecting to database: ", error);
  }
}

async function disconnectToDatabase() {
  await client.close();
  console.log("Disconnected successfully");
}

async function saveData(collectionName, data, db) {
  const collection = db.collection(collectionName);
  const result = await collection.insertOne(data);
  console.log("Data saved:", result.insertedId);
  return result.insertedId;
}

async function updateData(collectionName, id, newData, db) {
  const collection = db.collection(collectionName);
  const result = await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: newData }
  );
  console.log("Data updated:", result.modifiedCount);
  return result.modifiedCount;
}

async function getData(collectionName, query = {}, db) {
  const collection = db.collection(collectionName);
  const data = await collection.find(query).toArray();
  console.log("Data retrieved");
  return data;
}

async function getOneData(collectionName, query = {}, db) {
  const collection = db.collection(collectionName);
  const data = await collection.findOne(query);
  console.log("Data retrieved");
  return data;
}

async function getCollectionList(db = { dbName }) {
  const collections = await db.listCollections().toArray();
  console.log("Collections retrieved:", collections);
  return collections;
}

export {
  connectToDatabase,
  getData,
  saveData,
  updateData,
  getCollectionList,
  getOneData,
};
