require('dotenv').config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const stripe = require("stripe")(sk_test_51PU0z4P1TthxkHW33mdh5zyA4VVj1tECnzeXOZenzuPBPK8aBakgc8zX5qKp1Ra7x9FyBEIWEVnqPg5LWxetjAnt00MH1E474y );

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const calculateTotalOrderAmount = (items) => {
    // Assumes items is an array of objects with an `amount` property
    return items.reduce((total, item) => total + item.amount, 0) * 100;
};

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).send({ error: "Invalid items array" });
    } 

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: calculateTotalOrderAmount(items), 
            currency: "usd",
            description: "This is for GFG Stripe API Demo",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server started on PORT ${PORT}`);
});
