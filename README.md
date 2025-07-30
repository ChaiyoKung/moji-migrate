# Moji Migrate

A TypeScript-based migration tool that transfers financial transaction data from Firebase Realtime Database to MongoDB. This tool is specifically designed to migrate expense tracking data with proper category mapping and data transformation.

## 📋 Prerequisites

- [Bun](https://bun.sh) v1.2.10 or higher
- MongoDB instance (local or remote)
- Firebase project with Realtime Database
- Firebase Admin SDK service account key

## 🛠️ Installation

1. Install dependencies:

```bash
bun install
```

2. Set up environment variables:

```bash
cp .env.example .env
```

3. Configure your environment variables in `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/moji
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

4. Add your Firebase service account key:
   - Download the service account key from Firebase Console
   - Save it as `serviceAccountKey.json` in the project root

## 🚀 Usage

### Run the complete migration:

```bash
bun run src/index.ts
```

This will:

1. Connect to MongoDB
2. Initialize default categories (if not already present)
3. Migrate all transactions from Firebase to MongoDB
4. Disconnect from MongoDB

## 🔧 Configuration

### Hardcoded Values

The migration uses hardcoded user and account IDs:

- **USER_ID**: `6884ba75731f4706750784b8`
- **ACCOUNT_ID**: `6884ba7f731f4706750784c0`

Modify these values in `src/migrate-firebase.ts` if needed:

```typescript
const HARDCODED_USER_ID = "your_user_id";
const HARDCODED_ACCOUNT_ID = "your_account_id";
```

### Firebase Data Structure

The tool expects Firebase data in this structure:

```
/lists/
  └── listId/
      └── name: "category_name"

/records/
  └── userId/
      └── timestamp/
          ├── listID: "category_list_id"
          ├── date: "dd/mm/yyyy"
          ├── expense: number
          └── income: number
          └── balance: number
```

## 🔒 Security Notes

- Keep `serviceAccountKey.json` secure and never commit to version control
- Use environment variables for sensitive configuration
- Consider using MongoDB connection string with authentication in production
