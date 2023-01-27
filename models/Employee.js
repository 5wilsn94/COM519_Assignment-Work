const mongoose = require("mongoose");
const { Schema } = mongoose
const bcrypt = require('bcrypt');

const employeeSchema = new Schema(
    {
        employeeID: { type: Number, required: [true, 'ID is needed'], unique: true },
        password: { type: String, required: [true, 'Password is needed'] }
    },
    { timestamps: true }
);

employeeSchema.pre('save', async function (next) {
    console.log(this.password);
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('Could not hash password');
    }
})

module.exports = mongoose.model("Employee", employeeSchema);