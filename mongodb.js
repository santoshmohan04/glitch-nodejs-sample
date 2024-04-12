const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = `mongodb+srv://tagore412:fiFgP4mwb8phC9ol@cluster0.jebdamj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
  try {
    const database = client.db("test");
    const cards = database.collection("employeesdata");
    // const query = { employee_age: "23" };
    // const card = await cards.findOne(query);

    const card = await cards.find().limit(20);
    await card.forEach((t) => console.log(t));

    // console.log(card);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
