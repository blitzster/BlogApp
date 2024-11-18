const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config({ path: "./config.env" });

const client = new MongoClient(process.env.ATLAS_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let database;

module.exports = {
    connectToServer: async () => {
        try {
            await client.connect();
            database = client.db("blogData"); // Explicitly specify the database name
            console.log("Connected to MongoDB successfully");
        } catch (err) {
            console.error("Failed to connect to MongoDB:", err.message);
            process.exit(1); // Exit the process if connection fails
        }
    },
    getDb: () => {
        if (!database) {
            throw new Error("Database not initialized. Call connectToServer first.");
        }
        return database;
    },
};


// const { MongoClient, ServerApiVersion } = require('mongodb');
// require("dotenv").config({ path: "backend/config.env" });

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(process.env.ATLAS_URI, {
//     serverApi: {
//         version: ServerApiVersion.v1,
//         strict: true,
//         deprecationErrors: true,
//     }
// });

// let database

// module.exports = {
//     connectToServer: () => {
//         database = client.db("blogData");
//     },
//     getDb: () => {
//         return database
//     }
// }
// console.log("ATLAS_URI:", process.env.ATLAS_URI);


/*async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
run().catch(console.dir);*/
