import { app } from "./src/app.js";
import { sequelize } from "./models/index.js";

const PORT = process.env.PORT || 3000;

// Validate JWT settings before starting the API.
function validateAuthConfig() {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET is not configured securely");
  }
}

async function startServer() {
  try {
    validateAuthConfig();

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
