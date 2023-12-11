const BillingAddress = require("../db/Model/addressModel");
const ShippingAddress = require("../db/Model/shippingModel");
const express = require("express");
const auth = require("../auth");
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const email = req.query.email;
        const billing_details = await BillingAddress.findOne({ email: email });
        const shipping_details = await ShippingAddress.findOne({ email: email });
        res.status(200).json({ billing: billing_details, shipping: shipping_details });
    } catch (error) {
        res.status(500).json({ error });
    }
});

router.post('/shipping', async (request, response) => {

    try {
        const { email, firstName, lastName, contactNumber, addressEmail, streetAddress, city, zipCode, state, country, preferred, alternateNumber, deliveryInstruction } = request.body;
        const saved_email = await ShippingAddress.findOne({ email: email });
        if (!!saved_email) {
            await ShippingAddress.findOneAndUpdate({email:email},{
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                alternate_number: alternateNumber,
                address_email: addressEmail,
                street_address: streetAddress,
                city: city,
                zip_code: zipCode,
                state: state,
                country: country,
                delivery_instruction: deliveryInstruction,
                preferred: preferred
            }).then(()=>{
                response.status(200).json({ message: 'Updated Successfully.' })
            })
        } else {
            const address = new ShippingAddress({
                email: email,
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                address_email: addressEmail,
                street_address: streetAddress,
                city: city,
                zip_code: zipCode,
                state: state,
                country: country,
                preferred: preferred
            });
            address.save();
            response.status(200).json({ message: "Saved successfully." });
        }
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }

});

router.post('/billing', async (request, response) => {

    try {
        const { email, firstName, lastName, contactNumber, addressEmail, streetAddress, city, zipCode, state, country, preferred, alternateNumber, deliveryInstruction } = request.body;
        const saved_email = await BillingAddress.findOne({ email: email });
        if (!!saved_email) {
            await BillingAddress.findOneAndUpdate({email:email},{
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                alternate_number: alternateNumber,
                address_email: addressEmail,
                street_address: streetAddress,
                city: city,
                zip_code: zipCode,
                state: state,
                country: country,
                delivery_instruction: deliveryInstruction,
                preferred: preferred
            }).then(()=>{
                response.status(200).json({ message: 'Updated Successfully.' })
            })
        } else {
            const address = new BillingAddress({
                email: email,
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                address_email: addressEmail,
                street_address: streetAddress,
                city: city,
                zip_code: zipCode,
                state: state,
                country: country,
                preferred: preferred
            });
            address.save();
            response.status(200).json({ message: "Saved successfully." });
        }
    }
    catch (error) {
        response.status(500).json({ message: error.message })
    }

});

module.exports = router;