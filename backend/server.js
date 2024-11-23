const connect = require("./connect");
const express = require("express");
const cors = require("cors");
const posts = require("./postRoutes")
const users = require("./userRoutes")
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(posts)
app.use(users)
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.listen(PORT, () => {
    connect.connectToServer();
    console.log(`Server is Running on port ${PORT}`);
})