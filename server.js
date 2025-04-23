const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require("axios")
const qs = require("qs");

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert({
    "type": "service_account",
    "project_id": process.env.PROJECT_ID,
    "private_key_id": process.env.PRIVATE_KEY_ID,
    "private_key": process.env.PRIVATE_KEY,
    "client_email": process.env.CLIENT_EMAIL,
    "client_id": process.env.CLIENT_ID,
    "auth_uri": process.env.AUTH_URI,
    "token_uri": process.env.TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER,
    "client_x509_cert_url": process.env.CLIENT_URL,
    "universe_domain": "googleapis.com"
  })
});

const db = admin.firestore();

// Middleware to parse JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

// Endpoint to add a document to Firestore
app.post('/add-document', async (req, res) => {
  try {
    const { data } = req.body;
    const collection = data.collection;

    const docRef = db.collection(collection).doc();
    await docRef.set(data);

    res.status(200).send('Document added successfully');
  } catch (error) {
    console.error('Error adding document:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post("/read-collection", async (req, res) => {
  try {
    const collection = req.body.toSend.collection;

    console.log("-=-------------===")
    console.log(collection);

    // Specify your collection name
    const collectionRef = db.collection(collection);
    
    // Fetch all documents in the collection
    const snapshot = await collectionRef.get();
    
    if (snapshot.empty) {
      return res.status(404).json({ message: 'No documents found' });
    }
    
    // Map documents into a simple array of document data
    const documents = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the documents as JSON
    res.status(200).json(documents);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents: ' + error });
  }
})

app.post("/scrape-data", async (req, res) => {
  console.log("--------------")

  // console.log(req);

  const cat = req.body.data.category;
  const loc = req.body.data.location;
  const seAm = req.body.data.searchamount;

  console.log(cat, loc, seAm);

  const postData = qs.stringify({
    category: cat,
    location: loc,
    searchamount: seAm,
  });

  console.log(postData);

  try {
    // const flaskResponse = await axios.post("http://localhost:5000/", postData, {
    //   headers: {
    //     "Content-Type": "application/x-www-form-urlencoded",
    //   },
    // });

    const url = "http://127.0.0.1:5000/";

    const res = await fetch(url, {
      method: 'POST',
      headers: { "Content-Type": "application/x-www-form-urlencoded",},
      body: postData
    });

    console.log(res);

    console.log(res.body)

    res.json({
      message: "Data sent to Flask successfully!",
      data: res.body,
    });
  } catch (error) {
    console.error("Error posting to Flask:", error.message);
    res.status(500).send("Something went wrong.");
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});