import mongoose from "mongoose";

export const AREAS = [
  "Tránsito",
  "Espacios Públicos",
  "Inspección",
  "Seguridad Humana",
  "Deportes",
  "DIDECO",
  "Jurídico",
  "DOM",
  "SECPLA",
  "Delegación Peñalolén Alto",
];

export const TYPES = [
  "Alumbrado Público",
  "Vereda",
  "Poda / Tala",
  "Infraestructura",
  "Seguridad",
  "Espacios Públicos",
  "Otro",
];

// Prefijo del ID legible según la fuente de la solicitud

export const SOURCE_PREFIXES = {
  Terreno: "T",
  "Caminatas Nocturnas": "CN",
  Reunión: "R",
  Audiencias: "A",
  Correo: "C",
  "Solicitud Concejal": "I",
  "Red social": "RRSS",
  Otro: "O",
};

export const SOURCES = Object.keys(SOURCE_PREFIXES);

export const CABINET_STATUSES = [
  "No iniciado",
  "En diseño",
  "Terminado",
  "Infactible",
];

// Límites aproximados de Peñalolén (los mismos que usa MapView)

export const BOUNDS = {
  lat: { min: -33.54, max: -33.43 },
  lng: { min: -70.6, max: -70.47 },
};

const requestSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
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
      enum: TYPES,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    area: {
      type: String,
      required: true,
      enum: AREAS,
      index: true,
    },
    mayorCommitment: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      required: true,
      enum: [0, 1, 2, 3],
    },
    manager: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    organization: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    macroSector: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },
    source: {
      type: String,
      required: true,
      enum: SOURCES,
    },
    lat: {
      type: Number,
      min: BOUNDS.lat.min,
      max: BOUNDS.lat.max,
    },
    lng: {
      type: Number,
      min: BOUNDS.lng.min,
      max: BOUNDS.lng.max,
    },
    cabinetStatus: {
      type: String,
      enum: CABINET_STATUSES,
      default: "No iniciado",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
