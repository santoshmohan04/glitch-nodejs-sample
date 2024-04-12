/**
 * This is the main Node.js server script for your project
 * Check out the two endpoints this back-end API provides in fastify.get and fastify.post below
 */

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const router = express.Router();
const { MongoClient, ObjectId } = require("mongodb");

// Replace the uri string with your connection string.
const uri = `mongodb+srv://tagore412:fiFgP4mwb8phC9ol@cluster0.jebdamj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/", router);

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db("test").collection("employeesdata");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Get Employees Records Route
router.get("/employees", async function (req, res) {
  try {
    const users = await connectDB().find().limit(20).toArray();
    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
});

// Get Employee Record by Id Route
router.get("/employees/:id", async function (req, res) {
  const { id } = req.params;
  const collection = await connectDB();
  try {
    const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).json({ error: "Failed to retrieve user" });
  }
});

//To Create Employee record
router.post("/employees/create", async function (req, res) {
  const collection = await connectDB();
  try {
    const result = await collection.insertOne(req.body);
    const insertedId = result.insertedId;
    // Find the inserted document by its ID
    const insertedDocument = await collection.findOne({ _id: insertedId });
    res.status(201).json(insertedDocument);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

//To Update Employee record
router.put("/employees/:id", async function (req, res) {
  const { id } = req.params;
  const collection = await connectDB();
  try {
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
});

//To Delete Employee record
router.delete("/employees/:id", async function (req, res) {
  const { id } = req.params;
  const collection = await connectDB();
  try {
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

// Start the server
app.listen(3000, () => {
  console.log("Listening on PORT 3000");
});
