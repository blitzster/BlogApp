const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config({ path: "./config.env" });

let userRoutes = express.Router();
const SALT_ROUNDS = 6

// Helper to validate ObjectId
const isValidObjectId = (id) => {
    return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

// #1 Retrieve All
userRoutes.route("/users").get(async (req, res) => {
    try {
        let db = database.getDb();
        let data = await db.collection("users").find({}).toArray();

        if (data.length > 0) {
            res.json(data);
        } else {
            res.status(404).json({ error: "No users found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while retrieving users" });
    }
});

// #2 Retrieve One
userRoutes.route("/users/:id").get(async (req, res) => {
    try {
        let db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        let data = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
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
userRoutes.route("/users").post(async (req, res) => {
    try {
        let db = database.getDb();

        const takenEmail = await db.collection("users").findOne({ email: req.body.email });
        if (takenEmail) {
            res.json({ message: "The email is taken" });
        } else {
            const hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
            let mongoObject = {
                name: req.body.name,
                email: req.body.email,
                password: hash,
                joinDate: new Date(),
                posts: []
            };
            let result = await db.collection("users").insertOne(mongoObject);

            res.status(201).json({ message: "User created", user: result.ops[0] });
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while creating the post" });
    }
});

// #4 Update One
userRoutes.route("/users/:id").put(async (req, res) => {
    try {
        let db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        let mongoObject = {
            $set: {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                joinDate: req.body.joinDate,
                posts: req.body.posts
            }
        };
        let result = await db.collection("users").updateOne({ _id: new ObjectId(req.params.id) }, mongoObject);

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
userRoutes.route("/users/:id").delete(async (req, res) => {
    try {
        let db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        let result = await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });

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

// #6 - Login Route
userRoutes.route("/users/login").post(async (req, res) => {
    let db = database.getDb();

    const user = await db.collection("users").findOne({ email: req.body.email });

    if (user) {
        let confirmation = await bcrypt.compare(req.body.password, user.password)
        if (confirmation) {
            const token = jwt.sign(user, process.env.SECRETKEY, { expiresIn: "1h" })
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Incorrect Password" })
        }
    } else {
        res.json({ success: false, message: "User not found" })
    }
});

module.exports = userRoutes;
