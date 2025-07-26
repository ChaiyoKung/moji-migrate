import admin from "firebase-admin";
import { Types } from "mongoose";
import { Category } from "./models/Category";
import { Transaction } from "./models/Transaction";

// Initialize Firebase Admin SDK
// const serviceAccount = require("../serviceAccountKey.json");
import serviceAccount from "../serviceAccountKey.json";
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Constants
const HARDCODED_USER_ID = "6884ba75731f4706750784b8";
const HARDCODED_ACCOUNT_ID = "6884ba7f731f4706750784c0";

// Date conversion functions
function convertFirebaseDate(firebaseDate: string): Date {
  const parts = firebaseDate.split("/");
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${firebaseDate}`);
  }
  const day = parts[0];
  const month = parts[1];
  const year = parts[2];

  if (!day || !month || !year) {
    throw new Error(`Invalid date format: ${firebaseDate}`);
  }

  return new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T17:00:00.000Z`);
}

function convertTimestamp(timestamp: number): Date {
  return new Date(timestamp);
}

// Get Firebase categories map
async function getFirebaseCategoriesMap(): Promise<Record<string, string>> {
  const snapshot = await admin.database().ref("/lists").once("value");
  const lists = snapshot.val() || {};

  const categoriesMap: Record<string, string> = {};
  Object.keys(lists).forEach((listId) => {
    categoriesMap[listId] = lists[listId].name;
  });

  console.log("Firebase categories map:", categoriesMap);
  return categoriesMap;
}

// Get MongoDB categories map
async function getMongoCategoriesMap(): Promise<Record<string, string>> {
  const categories = await Category.find({});

  const categoriesMap: Record<string, string> = {};
  categories.forEach((category) => {
    categoriesMap[category.name] = (category._id as Types.ObjectId).toString();
  });

  console.log("MongoDB categories map:", categoriesMap);
  return categoriesMap;
}

// Main migration function
export async function migrateTransactions() {
  try {
    console.log("Starting Firebase to MongoDB migration...");

    // Get category maps
    const firebaseCategoriesMap = await getFirebaseCategoriesMap();
    const mongoCategoriesMap = await getMongoCategoriesMap();

    // Get Firebase records
    const recordsSnapshot = await admin.database().ref("/records").once("value");
    const allRecords = recordsSnapshot.val() || {};

    const transactions: any[] = [];
    let processed = 0;
    let skipped = 0;

    // Process each user's records
    Object.keys(allRecords).forEach((userId) => {
      const userRecords = allRecords[userId];

      Object.keys(userRecords).forEach((timestampKey) => {
        const record = userRecords[timestampKey];
        const timestampValue = parseInt(timestampKey);

        // Get category name from Firebase map
        const categoryName = firebaseCategoriesMap[record.listID];
        if (!categoryName) {
          console.warn(`No category found for listID: ${record.listID}`);
          skipped++;
          return;
        }

        // Get MongoDB category ObjectId
        const categoryId = mongoCategoriesMap[categoryName];
        if (!categoryId) {
          console.warn(`No MongoDB category found for name: ${categoryName}`);
          skipped++;
          return;
        }

        // Determine type and amount
        const isExpense = record.expense > 0;
        const amount = isExpense ? record.expense : record.income;
        const type = isExpense ? "expense" : "income";

        // Skip if amount is 0
        if (amount <= 0) {
          console.warn(`Skipping record with zero amount: ${JSON.stringify(record)}`);
          skipped++;
          return;
        }

        // Create transaction object
        const transaction = {
          userId: HARDCODED_USER_ID,
          accountId: HARDCODED_ACCOUNT_ID,
          categoryId: categoryId,
          type: type,
          amount: amount,
          currency: "THB",
          date: convertFirebaseDate(record.date),
          note: null,
          createdAt: convertTimestamp(timestampValue),
          updatedAt: convertTimestamp(timestampValue),
        };

        transactions.push(transaction);
        processed++;
      });
    });

    console.log(`Processed: ${processed}, Skipped: ${skipped}`);
    console.log(`Total transactions to insert: ${transactions.length}`);

    // Bulk insert transactions
    if (transactions.length > 0) {
      const result = await Transaction.insertMany(transactions);
      console.log(`Successfully inserted ${result.length} transactions`);
    } else {
      console.log("No transactions to insert");
    }
  } catch (error) {
    console.error("Migration failed:", error);
    throw error;
  }
}
