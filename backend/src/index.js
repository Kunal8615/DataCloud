import connectDB from "../src/database/index.js";
import { app } from "./app.js";

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
    app.listen(port, () => {
      console.log(`Server running at ${protocol}://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error(`Error connecting to database: ${e.message}`);
  });
