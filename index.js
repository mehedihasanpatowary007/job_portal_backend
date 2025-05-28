import dotenv from "dotenv";
dotenv.config();
import express, { json } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./utilis/db.js";
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import applicationRoute from "./routes/application.route.js";

const app = express();
const PORT = process.env.PORT_NO || 5000;

// middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

connectDB();

//api's
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/jobs", jobRoute);
app.use("/api/v1/application", applicationRoute);
//http://localhost:5000/jobs

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello I'm from backend!!!", success: true });
});

app.listen(PORT, () => {
  console.log("App listen on port no: ", PORT);
});
