import { initializeSeasonalData } from "../server/seasonal";

async function main() {
  try {
    console.log("Starting to initialize seasonal data...");
    await initializeSeasonalData();
    console.log("Seasonal data initialization completed successfully!");
  } catch (error) {
    console.error("Error initializing seasonal data:", error);
  }
}

main();