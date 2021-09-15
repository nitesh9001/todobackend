const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    // tasks: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "todos",
    //   }
    // ]
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("users", adminSchema);