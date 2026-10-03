import "dotenv/config";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

import connectDB from "./src/config/db.js";
import User from "./src/models/User.js";
import createApp from "./src/app.js";

try {
  if (
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.length < 32
  ) {
    throw new Error(
      "Agrega SESSION_SECRET backend/.env."
    );
  }

  await connectDB();
  await User.init();

  const store = MongoStore.create({
    client: mongoose.connection.getClient(),
    dbName: mongoose.connection.name,
    collectionName: "sessions",
  });

  store.on("error", () => {
    console.error("Error del almacenamiento de sesiones.");
  });

  const app = createApp({
    store,
    secret: process.env.SESSION_SECRET,
    frontendOrigin:
      process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  });

  const port = Number(process.env.PORT) || 3000;

  app.listen(port, "127.0.0.1", () => {
    console.log(`API disponible en http://localhost:${port}`);
  });
} catch (error) {
  console.error("No se pudo iniciar el backend:", error.message);
  await mongoose.disconnect();
  process.exitCode = 1;
}