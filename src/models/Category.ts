import { Schema, model, Document, Types } from "mongoose";

export interface ICategory extends Document {
  userId: Types.ObjectId | null;
  name: string;
  type: "income" | "expense";
  icon: string;
  color: string;
  parentId: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "categories",
  }
);

export const Category = model<ICategory>("Category", CategorySchema);
