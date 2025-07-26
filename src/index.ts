import { initializeCategories } from "./seeders/init-categories";
import { database } from "./utils/database";

async function main() {
  try {
    await database.connect();

    await initializeCategories();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await database.disconnect();
  }
}

main();
