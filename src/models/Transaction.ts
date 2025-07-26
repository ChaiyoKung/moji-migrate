import { Schema, model, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  accountId: Types.ObjectId;
  categoryId: Types.ObjectId;
  type: string;
  amount: number;
  currency: string;
  note?: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    accountId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Account",
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "THB",
    },
    note: {
      type: String,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "transactions",
  }
);

export const Transaction = model<ITransaction>("Transaction", TransactionSchema);
