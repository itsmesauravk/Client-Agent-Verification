const uuid = require('uuidv4')





const addPayment = async (req, res) => {
    try {
        const { amount, tax_amount, total_amount, product_code, product_service_charge, product_delivery_charge, success_url, failure_url, signed_field_names, signature } = req.body;
        const newPayment = new Payment({ amount, tax_amount, total_amount, product_code, product_service_charge, product_delivery_charge, success_url, failure_url, signed_field_names, signature });
        await newPayment.save();
        res.status(201).json(newPayment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}