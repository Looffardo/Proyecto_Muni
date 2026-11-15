import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    code: {
      type: Number,
      required: true,
      min: 1,
      immutable: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    area: {
      type: String,
      required: true,
      trim: true,
    },
    mayorCommitment: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    manager: {
      type: String,
      trim: true,
      default: "",
    },
    organization: {
      type: String,
      trim: true,
      default: "",
    },
    macroSector: {
      type: String,
      trim: true,
      default: "",
    },
    source: {
      type: String,
      trim: true,
      default: "",
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    photoUrl: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Pendiente", "En proceso", "Resuelta"],
      default: "Pendiente",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true, autoIndex: false }
);

requestSchema.index({ code: 1 }, { unique: true });

export default mongoose.model("Request", requestSchema);
