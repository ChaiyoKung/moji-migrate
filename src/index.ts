import { initializeCategories } from "./seeders/init-categories";
import { migrateTransactions } from "./migrate-firebase";
import { database } from "./utils/database";

async function main() {
  try {
    await database.connect();

    await initializeCategories();
    await migrateTransactions();
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await database.disconnect();
  }
}

main();
