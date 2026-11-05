import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["Tránsito", "Espacios Públicos", "Inspección", "Seguridad Humana", "Deportes", "DIDECO", "Jurídico", "DOM", "SECPLA", "Delegación Peñalolén Alto","GESCOM"]
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);