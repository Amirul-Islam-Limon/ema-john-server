const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.5gzdwso.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {serverApi: {version: ServerApiVersion.v1,strict: true,deprecationErrors: true,}});

async function run() {
  try {
    
      const productCollection = client.db("emaJohnDb").collection("products");

      app.get("/products", async (req, res) => {
          const page = req.query.page;
          const size = req.query.size;
          console.log(page, size);
          const query = {};
          const cursor = productCollection.find(query);
          const products = await cursor.skip(+(page*size)).limit(+size).toArray();
          const count = await productCollection.estimatedDocumentCount();
          res.send({count, products});
      })
    
    
    app.post("/productsByIds", async (req, res) => {
      const ids = req.body;
      const objectIds = ids.map(id=> new ObjectId(id))
      console.log(objectIds);
      const query = {_id:{$in:objectIds}};
      const cursor = productCollection.find(query);
      const results = await cursor.toArray();
      res.send(results);
      
    })
      
      
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    
    // await client.close();
  }
}
run().catch(error=> console.error(error));



app.get("/", (req, res) => {
    res.send("Ema John Server is Running")
})


app.listen(port, () => {
    console.log(`Ema john server is running on : ${port}`)
})


// userName:ema-john-shopping
// password:PSSLLH14DSjvnfKn