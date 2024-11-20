const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "./config.env" });

let postRoutes = express.Router();

// Helper to validate ObjectId
const isValidObjectId = (id) => {
    return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

// #1 Retrieve All
postRoutes.route("/posts").get(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection("posts").find({}).toArray();

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ error: "No posts found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while retrieving posts" });
    }
});

// #2 Retrieve One
postRoutes.route("/posts/:id").get(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        let data = await db.collection("posts").findOne({ _id: new ObjectId(req.params.id) });
        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: "Post not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while retrieving the post" });
    }
});

// #3 Create One
postRoutes.route("/posts").post(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        let mongoObject = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            author: req.body.user._id,
            dateCreated: req.body.dateCreated,
        };
        let result = await db.collection("posts").insertOne(mongoObject);

        res.status(201).json({ message: "Post created", post: result.ops[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while creating the post" });
    }
});

// #4 Update One
postRoutes.route("/posts/:id").put(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        let mongoObject = {
            $set: {
                title: req.body.title,
                description: req.body.description,
                content: req.body.content,
                author: req.body.author,
                dateCreated: req.body.dateCreated,
            },
        };
        let result = await db.collection("posts").updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);

        if (result.matchedCount === 0) {
            res.status(404).json({ error: "Post not found" });
        } else {
            res.json({ message: "Post updated", updated: result.modifiedCount });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while updating the post" });
    }
});

// #5 Delete One
postRoutes.route("/posts/:id").delete(verifyToken, async (req, res) => {
    try {
        let db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        let result = await db.collection("posts").deleteOne({ _id: new ObjectId(req.params.id) });

        if (result.deletedCount === 0) {
            res.status(404).json({ error: "Post not found" });
        } else {
            res.json({ message: "Post deleted", deleted: result.deletedCount });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while deleting the post" });
    }
});

function verifyToken(request, response, next) {
    const authHeaders = request.headers["authorization"]
    const token = authHeaders && authHeaders.split(' ')[1]
    if (!token) {
        return response.status(401).json({ message: "Authentication token is missing" })

    }

    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error) {
            return response.status(403).json({ message: "Invalid Token" })
        }

        request.body.user = user
        next()
    })
}

module.exports = postRoutes;
