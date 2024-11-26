const mongoose = require("mongoose");
const paymentsSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    status: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
    payer: {
        type: mongoose.Schema.Types.Array,
        required: true,
    },
    createdDate: {
        type: mongoose.Schema.Types.String,
        default: new Date(),
    },
});

module.exports = mongoose.model("payments", paymentsSchema);