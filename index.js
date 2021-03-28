const express = require('express');
const app = express();
const cors = require('cors');
const webpush = require('web-push');

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());

const subscriptions = [];

app.get('/', (req, res) => {
    res.send("Hello world");
});

app.post('/subscription/add', (req, res) => {
    // endpoint to add a subscription to the list;
    const sub = req.body;
    subscriptions.push(sub);
    res.send({
        subscriptionSaved: sub
    });
    console.log(subscriptions);
});

app.get('/notify', (req, res) => {
    const vapidKeys = {
        publicKey: "BMOPb7ypTabNjOyGi4nyHUrQm6xGJPO5Ts6JZQHSeWXk7Yul0Z5kJt-TlUAJMYu7WlzTYnbVZR-ctvmVxOZW_Hc",
        privateKey: "GfZcwzCHw8R8JYgTh5_0Nn6_MHArPnEiaqdkPyc785E"
    }

    webpush.setVapidDetails(
        "mailto:utkarsh.pant@outlook.com",
        vapidKeys.publicKey,
        vapidKeys.privateKey
    )

    const dataToSend = JSON.stringify({ title: "Hello" });

    let notificationsSent = [];
    subscriptions.forEach(sub => {
        notificationsSent.push(triggerPushMessage(sub, dataToSend));
    })

    // console.log("Subscriptions", subscriptions);

    Promise.all([notificationsSent])
        .then(values => {
            res.send("Triggered all subscriptions.");
        })
        .catch(err => {
            console.log("An error occured in triggering all subs.");
            res.status(500).send();
        })

});

const triggerPushMessage = (subscription, dataToSend) => {
    return webpush.sendNotification(subscription, dataToSend)
        .catch(err => {
            console.log("An error occured in sending the notification", err);
        })
}

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Server listening on ${port}`);
});