import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()


app.use(cors(
    {
        origin : "*",
        credentials : true
    }
));

app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());

// Root route to display a message
app.get("/", (req, res) => {
    res.send("Welcome to the DataCloud API! Use the available routes to interact with the platform.");
});

  //routes
  import userRoute from "../src/routes/user.route.js"
  import dataRoute from "../src/routes/data.route.js"
  
  

  app.use("/api/v2/user",userRoute);
  app.use("/api/v2/data",dataRoute);
  export { app };