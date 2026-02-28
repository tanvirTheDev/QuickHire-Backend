import "dotenv/config";
import "express-async-errors";

import app from "./app";
import connectDB from "./config/db";

const startServer = async (): Promise<void> => {
  await connectDB();

  const port = Number(process.env.PORT) || 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer();
