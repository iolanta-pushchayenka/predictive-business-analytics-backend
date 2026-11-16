
import { app } from "./src/app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    await sequelize.close();
    process.exitCode = 1;
  }
}

startServer();
