const express = require("express");
const cors = require("cors"); // cross origin resource sharing
const mongodb = require("mongodb"); // mongo db

const { MongoClient } = mongodb; // to connect mongodb
const app = express(); // backend in a variable
//const cookieParser = require("cookie-parser");
// const sessions = require("express-session");
// const oneDay = 1000 * 60 * 60 * 24;
// var session;
// app.use(cookieParser());
// app.use(
//   sessions({
//     secret: "secret",
//     saveUninitialized: true,
//     cookie: { maxAge: oneDay },
//     resave: false,
//   })
// );

app.use(cors()); // using cors
require("dotenv").config(); // configuring dot env
app.use(express.json());

const port = 4000;

const url =
  "mongodb+srv://WEBTOON:NTDNTDNTD@cluster0.wxtmufn.mongodb.net/DogPerson?retryWrites=true&w=majority";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ObjectId = mongodb.ObjectId;

//-------mongoose------//

const mongoose = require("mongoose");
const { ApolloServer, gql } = require("apollo-server-express");

const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");

async function startServer() {
  const app = express();
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({ app: app, path: "/gql" });

  app.use((req, res) => {
    res.send("Hello from gql");
  });

  mongoose
    .connect(url)
    .then(() => console.log("Database connected!"))
    .catch((err) => console.log(err));

  app.listen(4001, () => console.log("Server is running on port 4001"));
}

startServer();

async function server() {
  try {
    // connecting with mongodb
    await client.connect();
    // getting database
    const database = client.db("DogPerson");
    // getting the collections/ tables.
    const productCollection = database.collection("product");
    const reviewCollection = database.collection("review");
    const users = database.collection("users");
    const orderListCollection = database.collection("orderList");

    //crud

    app.get("/products/:id", async (req, res) => {
      const { id } = req.params;
      const filter = {
        _id: ObjectId(id),
      };
      const result = await productCollection.findOne(filter);
      res.json(result);
    });
    app.get("/products", async (req, res) => {
      const query = req.query;
      // const cursor = productCollection.find(query);
      //const result = await productCollection.find({}).toArray();
      const page = parseInt(req.query.page > 0 ? req.query.page : 0) - 1;
      // const perpage = parseInt(req.query.perpage);
      const perpage = 20;
      const type = req.query.type;
      const subtype = req.query.subtype;
      const pageNo = query.page;

      const filter = {
        type: type,
        subtype: subtype,
      };

      //subtype is empty
      const filter2 = {
        type: type,
      };
      if (type == "" && subtype == "") {
        const cursor = productCollection
          .find({})
          .skip((pageNo - 1) * perpage)
          .limit(perpage);
        const result = await cursor.toArray();
        res.json(result);
      } else if (subtype == "") {
        const cursor = productCollection
          .find(filter2)
          .skip((pageNo - 1) * perpage)
          .limit(perpage);
        const result = await cursor.toArray();
        res.json(result);
      } else {
        const cursor = productCollection
          .find(filter)
          .skip((pageNo - 1) * perpage)
          .limit(perpage);
        const result = await cursor.toArray();
        res.json(result);
      }
    });

    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {
        productID: ObjectId(id),
      };

      const cursor = reviewCollection.find(filter);
      const result = await cursor.toArray();
      res.json(result);
    });
    app.get("/reviews", async (req, res) => {
      const resi = await reviewCollection.deleteMany({});
      res.json(resi);
    });
    app.post("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const { rating, description, title, username } = req.body;
      const doc = {
        productID: ObjectId(id),
        title,
        rating,
        description,
        like: 0,
        username,
        dislike: 0,
        review_date: new Date(),
        react: {},
      };
      console.log(doc);
      const result = await reviewCollection.insertOne(doc);
      res.json(result);
    });
    app.put("/reviews/:id", async (req, res) => {
      const body = req.body;
      const id = req.params.id;
      const filter = {
        _id: ObjectId(id),
      };
      const result = await reviewCollection.updateOne(filter, {
        $set: {
          ...body,
        },
      });
      res.json(result);
    });

    app.get("/login", async (req, res) => {
      const { email, password } = req.query;
      const filter = { email, password };
      const result = await users.findOne(filter);
      // req.session.isAuth = true;
      res.json(result ? result : false);
    });

    app.get("/users/:email", async (req, res) => {
      const { email } = req.params;
      const result = await users.findOne({ email: email });
      res.json(result === null ? false : true);
    });
    app.get("/users", async (req, res) => {
      const cursor = await users.find({}).toArray();
      console.log(cursor);
      res.json(cursor);
    });
    app.post("/users", async (req, res) => {
      const data = req.body;
      const result = await users.insertOne(data);
      res.json(result);
    });
    app.get("/order-details/:userid", async (req, res) => {
      const { userid } = req.params;
      const filter = {
        buyerID: userid,
      };
      const cursor = orderListCollection.find(filter);
      const result = await cursor.toArray();
      res.json(result);
    });
    app.delete("/order-details/:orderid", async (req, res) => {
      const { orderid } = req.params;
      const filt = {
        _id: ObjectId(orderid),
      };
      const result = await orderListCollection.deleteOne(filt);
      res.json(result);
    });
    app.post("/order-details", async (req, res) => {
      const productInfo = req.body;
      const result = await orderListCollection.insertOne(productInfo);
      res.json(result.insertedId);
    });
  } finally {
  }
}
server().catch(console.dir);

// //for graphql section
// const {ApolloServer}=require('apollo-sever');
// const mongoose=require('mongoose');
// const typeDefs=require('./graphql/typeDefs');
// const resolvers=require('graphql/resolvers');

app.get("/", (req, res) => {
  res.json("Hello world");
});

app.listen(port, () => {
  console.log(port);
});
