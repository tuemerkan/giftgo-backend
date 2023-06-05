const express = require("express");
const app = express();
const port = process.env.PORT || 4000; // or another port if you prefer
const bodyParser = require("body-parser");
const { getStoredPosts, storePosts } = require("./data/posts");

const MongoClient = require("mongodb").MongoClient;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ limit: "5mb", extended: true }));

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get("/posts", async (req, res) => {
  const storedPosts = await getStoredPosts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ posts: storedPosts });
});

app.get("/posts/:id", async (req, res) => {
  const storedPosts = await getStoredPosts();
  const post = storedPosts.find((post) => post.id === req.params.id);
  res.json({ post });
});

app.post("/posts", async (req, res) => {
  const existingPosts = await getStoredPosts();
  const postData = req.body;
  const newPost = {
    ...postData,
    id: Math.random().toString(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: "Stored new post.", post: newPost });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

app.post("/register", (req, res) => {
  // your registration handling code here
});

MongoClient.connect(
  "mongodb+srv://tuemerkan:tomatensosse@cluster0.dotlzvn.mongodb.net/?retryWrites=true&w=majority",
  { useUnifiedTopology: true }
)
  .then((client) => {
    console.log("Connected to Database");
    const db = client.db("yourDatabaseName");
    // your database handling code here
  })
  .catch((error) => console.error(error));
