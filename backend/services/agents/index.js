import "dotenv/config";
import express from "express";
import connectDB from "./config/dbconnect.js";
import router from "./routes/agent.route.js";

//dotenv.config()
// console.log(process.env.GOOGLE_API_KEY)
const port = process.env.PORT;

const app = express();
app.use(express.json());
app.use("/", router);

app.use((err, req, res, next) => {
  console.error(err);

  if (err.status) {
    return res.status(err.status).json(err.data);
  }

  return res.status(500).json({
    message: `Error from Agent Service ${err}`
  });
});

app.get("/", (req, res) => {
  return res.json({ message: "Agent service running" });
});
app.listen(port, (req, res) => {
  console.log(`Agent service running at port : ${port}`);
  connectDB();
});
