const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const Cloudant = require('@cloudant/cloudant');

// Initialize Cloudant connection with IAM authentication
async function dbCloudantConnect() {
    try {
        const cloudant = Cloudant({
            plugins: { iamauth: { iamApiKey: '9Ki-erPFa9PCo0PlZKMK4jsLY32RzGZCu_POQeCMSuLO' } }, // Replace with your IAM API key
            url: 'https://52072aed-4ff9-4ebf-842b-61bb014d6c3a-bluemix.cloudantnosqldb.appdomain.cloud', // Replace with your Cloudant URL
        });

        const db = cloudant.use('dealerships');
        console.info('Connect success! Connected to DB');
        return db;
    } catch (err) {
        console.error('Connect failure: ' + err.message + ' for Cloudant DB');
        throw err;
    }
}

let db;

(async () => {
    db = await dbCloudantConnect();
})();

app.use(express.json());

// Define a route to get all dealerships with optional state and ID filters
app.get('/dealerships/get', (req, res) => {
    const { state, id } = req.query;

    // Create a selector object based on query parameters
    const selector = {};
    if (state) {
        selector.state = state;
    }
    if (id) {
        selector._id = id;
    }

    const queryOptions = {
        selector,
        limit: 10, // Limit the number of documents returned to 10
    };

    db.find(queryOptions, (err, body) => {
        if (err) {
            console.error('Error fetching dealerships:', err);
            res.status(500).json({ error: 'An error occurred while fetching dealerships.' });
        } else {
            const dealerships = body.docs;
            res.json(dealerships);
        }
    });
});

// Define a route to get all dealerships for a given state
app.get('/dealerships', async (req, res) => {
    const { state } = req.query;

    if (!state) {
        return res.status(400).json({ error: 'State parameter is required.' });
    }

    try {
        const queryOptions = {
            selector: {
                state: state, // Use the provided state value
            },
            limit: 10,
        };

        const result = await db.find(queryOptions);
        const dealerships = result.docs;
        res.json(dealerships);
    } catch (err) {
        console.error('Error fetching dealerships:', err);
        res.status(500).json({ error: 'An error occurred while fetching dealerships.' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});