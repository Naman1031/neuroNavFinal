import { app } from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB connection error: " + err);
  });
