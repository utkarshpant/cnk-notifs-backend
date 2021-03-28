const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded());

const subscriptions = [];

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.get('/subscription/add', (req, res) => {
    // endpoint to add a subscription to the list;
});

app.get('/notify/:subscriptionId', (req, res) => {
    // trigger a notification;
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});