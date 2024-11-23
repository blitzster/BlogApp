const express = require("express");
const database = require("./connect");
const ObjectId = require("mongodb").ObjectId;
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
require("dotenv").config({ path: "./config.env" });

const postRoutes = express.Router();

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory for uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filenames
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only images are allowed"), false);
        }
    }
});

// Helper to validate ObjectId
const isValidObjectId = (id) => {
    return ObjectId.isValid(id) && String(new ObjectId(id)) === id;
};

// Middleware to verify token
function verifyToken(request, response, next) {
    const authHeaders = request.headers["authorization"];
    const token = authHeaders && authHeaders.split(" ")[1];
    if (!token) {
        return response.status(401).json({ message: "Authentication token is missing" });
    }

    jwt.verify(token, process.env.SECRETKEY, (error, user) => {
        if (error) {
            return response.status(403).json({ message: "Invalid Token" });
        }

        request.body.user = user;
        next();
    });
}

// Serve static files from uploads directory
postRoutes.use("/uploads", express.static(path.join(__dirname, "uploads")));

// #1 Retrieve All Posts
postRoutes.get("/posts", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        const data = await db.collection("posts").find({}).toArray();

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

// #2 Retrieve One Post
postRoutes.get("/posts/:id", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const data = await db.collection("posts").findOne({ _id: new ObjectId(req.params.id) });
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

// #3 Create a Post with Optional Image
postRoutes.post("/posts", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const db = database.getDb();
        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

        const post = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            author: req.body.user._id,
            dateCreated: new Date(),
            image: imagePath // Save the image path if an image is uploaded
        };

        const result = await db.collection("posts").insertOne(post);
        res.status(201).json({ message: "Post created", post: result.ops[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "An error occurred while creating the post" });
    }
});

// #4 Update a Post with Optional Image Update
postRoutes.put("/posts/:id", verifyToken, upload.single("image"), async (req, res) => {
    try {
        const db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
        const updateFields = {
            title: req.body.title,
            description: req.body.description,
            content: req.body.content,
            dateCreated: new Date(),
            ...(imagePath && { image: imagePath }) // Include image only if uploaded
        };

        const result = await db.collection("posts").updateOne(
            { _id: new ObjectId(req.params.id) },
            { $set: updateFields }
        );

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

// #5 Delete a Post
postRoutes.delete("/posts/:id", verifyToken, async (req, res) => {
    try {
        const db = database.getDb();
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ error: "Invalid ID format" });
        }

        const result = await db.collection("posts").deleteOne({ _id: new ObjectId(req.params.id) });

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

module.exports = postRoutes;
