import { database } from "../utils/database.js";
import { Category, type ICategory } from "../models/Category.js";

const categoriesData = [
  {
    userId: null,
    name: "ได้เงิน",
    type: "income" as const,
    icon: "💰",
    color: "#4CAF50", // เขียวสื่อถึงรายรับ
    parentId: null,
  },
  {
    userId: null,
    name: "ข้าวเช้า",
    type: "expense" as const,
    icon: "🍳",
    color: "#FFA726", // ส้มอ่อน เหมือนแสงเช้า
    parentId: null,
  },
  {
    userId: null,
    name: "ข้าวเที่ยง",
    type: "expense" as const,
    icon: "🍛",
    color: "#FFB74D", // ส้ม
    parentId: null,
  },
  {
    userId: null,
    name: "ข้าวเย็น",
    type: "expense" as const,
    icon: "🍲",
    color: "#FF7043", // ส้มเข้มเหมือนช่วงเย็น
    parentId: null,
  },
  {
    userId: null,
    name: "เครื่องดื่ม",
    type: "expense" as const,
    icon: "🥤",
    color: "#00BCD4", // ฟ้าน้ำแข็ง
    parentId: null,
  },
  {
    userId: null,
    name: "ขนม",
    type: "expense" as const,
    icon: "🍩",
    color: "#F06292", // ชมพูหวาน ๆ
    parentId: null,
  },
  {
    userId: null,
    name: "ของใช้",
    type: "expense" as const,
    icon: "🧻",
    color: "#9E9E9E", // เทา อุปกรณ์ของใช้ทั่วไป
    parentId: null,
  },
  {
    userId: null,
    name: "ของเล่น",
    type: "expense" as const,
    icon: "🧸",
    color: "#BA68C8", // ม่วงน่ารัก
    parentId: null,
  },
  {
    userId: null,
    name: "ซักผ้า",
    type: "expense" as const,
    icon: "🧺",
    color: "#4FC3F7", // ฟ้าอ่อนเหมือนฟองน้ำ/ผ้าสะอาด
    parentId: null,
  },
  {
    userId: null,
    name: "เติมน้ำมัน",
    type: "expense" as const,
    icon: "⛽",
    color: "#F44336", // แดงเหมือนน้ำมัน
    parentId: null,
  },
  {
    userId: null,
    name: "อื่นๆ",
    type: "expense" as const,
    icon: "🗂️",
    color: "#90A4AE", // เทาน้ำเงินอ่อน สื่อถึงหมวดทั่วไป
    parentId: null,
  },
];

export async function initializeCategories() {
  try {
    console.log("🚀 Starting category initialization...");

    // Check if categories already exist
    const existingCategories = await Category.countDocuments({ userId: null });

    if (existingCategories > 0) {
      console.log(`⚠️  Found ${existingCategories} existing default categories.`);
      console.log(
        "Do you want to clear existing categories and reinitialize? (This will delete all existing default categories)"
      );

      // For now, we'll skip if categories exist. You can modify this behavior as needed.
      console.log("Skipping initialization to avoid duplicates.");
      console.log("If you want to reset categories, manually delete them first or modify this script.");
      return;
    }

    // Insert categories
    console.log("📝 Inserting categories...");
    const insertedCategories = await Category.insertMany(categoriesData);

    console.log(`✅ Successfully inserted ${insertedCategories.length} categories:`);

    // Group by type for better output
    const incomeCategories = insertedCategories.filter((cat) => cat.type === "income");
    const expenseCategories = insertedCategories.filter((cat) => cat.type === "expense");

    if (incomeCategories.length > 0) {
      console.log("\n💰 Income Categories:");
      incomeCategories.forEach((cat: ICategory) => {
        console.log(`  ${cat.icon} ${cat.name} (${cat.color})`);
      });
    }

    if (expenseCategories.length > 0) {
      console.log("\n💸 Expense Categories:");
      expenseCategories.forEach((cat: ICategory) => {
        console.log(`  ${cat.icon} ${cat.name} (${cat.color})`);
      });
    }

    console.log("\n🎉 Category initialization completed successfully!");
  } catch (error) {
    console.error("❌ Error during category initialization:", error);
    throw error;
  }
}
