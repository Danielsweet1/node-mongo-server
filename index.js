const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

//user: sweet1
//pass: T3lkJAAks9XdxUas

const uri =
  "mongodb+srv://sweet1:T3lkJAAks9XdxUas@cluster0.qykigfw.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    const userCollection = client.db("nodeMongoCrud").collection("users");

    app.get("/users", async (req, res) => {
      const query = {};
      const cursor = userCollection.find(query);
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/update/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const option = { upsert: true };
      const updatedUser = {
        $set: {
          name: user.name,
          address: user.address,
          email: user.email,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedUser,
        option
      );
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      console.log(user);
      res.send(user);
    });

    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
  } finally {
  }
};

run().catch((e) => console.error(e));

app.get("/", (req, res) => {
  res.send("server running");
});

app.listen(port, () => {});
