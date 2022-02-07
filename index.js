const express = require('express');
const app = express();
// require cors and use as middleware
const cors = require('cors');
require('dotenv').config()
const { MongoClient } = require('mongodb');

const port = process.env.PORT || 5000;
// use cors as middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.yw3x3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(uri)

// connect database to server

async function run() {
    try {
        await client.connect();

        const database = client.db('online-school')
        const courseCollection = database.collection('courses')
        const enrollmentsCollection = database.collection('enrollments')

        // get all Courses
        app.get('/courses', async (req, res) => {
            const cursor = courseCollection.find({})
            const allCourses = await cursor.toArray();
            res.json(allCourses)
        })

        // get enrolled courses
        app.get('/myCourses', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            console.log(query)
            const cursor = enrollmentsCollection.find(query)
            const myCourses = await cursor.toArray();
            res.json(myCourses)
        })



        // post enrollment request
        app.post('/enrollments', async (req, res) => {
            const enrollment = req.body;
            const result = await enrollmentsCollection.insertOne(enrollment)
            console.log(result)
            res.json(result)
        })


    }
    finally {
        // await.client.connect();
    }

}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('runnig online school server')
});

app.listen(port, () => {
    console.log(`listening at ${port}`)
})
