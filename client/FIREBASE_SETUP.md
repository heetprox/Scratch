# Firebase Setup for ScratchCard Application

## Prerequisites

1. Create a Firebase account at [firebase.google.com](https://firebase.google.com/)
2. Create a new Firebase project
3. Enable Firestore Database in your Firebase project
4. Set up Firebase Authentication (if needed)

## Configuration

1. Copy the `.env.local.example` file to `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Go to your Firebase project settings > General > Your apps > Web app
3. If you haven't already, register a new web app
4. Copy the Firebase configuration values to your `.env.local` file:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## Firestore Database Structure

The application uses two main collections:

### 1. scratchCards

Each document in this collection represents a scratch card with the following fields:

- `username`: String - The username of the scratch card owner
- `name`: String - The display name of the scratch card
- `image`: String - URL to the scratch card image
- `description`: String - Description of the scratch card
- `WalletAddress`: Array - List of wallet addresses associated with the scratch card
  - `network`: String - The blockchain network (e.g., "ethereum", "sepolia")
  - `address`: String - The wallet address
- `payments`: Array - List of payment IDs (optional, can be queried separately)

### 2. payments

Each document in this collection represents a payment with the following fields:

- `scratchCardId`: String - Reference to the scratch card
- `amount`: Number - The payment amount
- `network`: String - The blockchain network used for payment
- `address`: String - The recipient address
- `done`: Boolean - Whether the payment is completed
- `transactionHash`: String - The blockchain transaction hash (if completed)
- `timestamp`: Timestamp - When the payment was made

## API Endpoints

The application provides the following API endpoints for interacting with Firebase:

### Scratch Cards

- `GET /api/scratch-cards?id=<id>` - Get a scratch card by ID
- `GET /api/scratch-cards?username=<username>` - Get a scratch card by username
- `GET /api/scratch-cards?query=<query>` - Search scratch cards
- `POST /api/scratch-cards` - Create a new scratch card
- `PUT /api/scratch-cards?id=<id>` - Update a scratch card
- `DELETE /api/scratch-cards?id=<id>` - Delete a scratch card

### Payments

- `GET /api/payments?id=<id>` - Get a payment by ID
- `GET /api/payments?scratchCardId=<scratchCardId>` - Get payments for a scratch card
- `POST /api/payments` - Create a new payment
- `PUT /api/payments?id=<id>` - Update a payment
- `PATCH /api/payments` - Mark a payment as complete

### Wallet Addresses

- `POST /api/wallet-address` - Add a wallet address to a scratch card
- `DELETE /api/wallet-address?scratchCardId=<id>&network=<network>` - Remove a wallet address

### Blockchain Integration

- `POST /api/blockchain-payment` - Record a payment from blockchain event

## Security Rules

Make sure to set up appropriate Firestore security rules to protect your data. Here's a basic example:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /scratchCards/{document=**} {
      allow read;
      allow write: if request.auth != null;
    }
    match /payments/{document=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

Adjust these rules according to your application's security requirements.