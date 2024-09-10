import connectDB from "../src/database/index.js";
import { app } from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server running on port ${process.env.PORT || 8000}`);
    });
})
.catch((e)=>{
    console.error(`Error connecting to database: ${e.message}`);
  
})