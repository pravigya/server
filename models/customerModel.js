const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNo :{ type:String }
});

const Customer = mongoose.model("customer", customerSchema);

module.exports = Customer;
