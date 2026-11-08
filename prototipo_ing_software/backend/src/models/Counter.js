import mongoose from "mongoose";

// Correlativo por prefijo. El _id es el prefijo de la fuente (T, CN, R...).

const counterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, required: true },
  },
  { versionKey: false }
);

export default mongoose.model("Counter", counterSchema);
