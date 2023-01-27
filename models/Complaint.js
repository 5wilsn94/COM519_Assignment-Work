const mongoose = require("mongoose");
const { Schema } = mongoose;

const complaintSchema = new Schema(
    {
        employee_id: Number,
        store_number: Number,
        time: String,
        complaint_type: String,
        description: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);