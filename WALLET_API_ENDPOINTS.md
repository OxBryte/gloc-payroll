# Wallet API Endpoints

This document outlines the API endpoints required for the Wallet feature.

## Base URL

```
/api/wallet or /wallet (depending on your routing structure)
```

## Authentication

All endpoints require authentication via Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Create Wallet

**POST** `/wallet/create`

**Description:** Create a new wallet for the authenticated user

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json`

**Request Body:**

```json
{
  "name": "string (required) - Wallet name",
  "address": "string (required) - Wallet address (0x...)",
  "image": "string (optional) - Image URL or base64",
  "gradient": "string (optional) - CSS gradient string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Wallet created successfully",
  "data": {
    "_id": "string",
    "userId": "string",
    "name": "string",
    "address": "string",
    "balance": 0,
    "image": "string | null",
    "gradient": "string",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `201` - Created successfully
- `400` - Validation error (missing required fields, invalid address format, etc.)
- `401` - Unauthorized (invalid or missing token)
- `500` - Server error

**Validation Rules:**
- `name`: Required, string, min 1 character, max 100 characters
- `address`: Required, valid Ethereum address (starts with "0x", 42 characters)
- `image`: Optional, string (URL or base64)
- `gradient`: Optional, string (CSS gradient)

---

### 2. Get All Wallets

**GET** `/wallets`

**Description:** Fetch all wallets belonging to the authenticated user

**Headers:**
- `Authorization: Bearer <token>` (required)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "userId": "string",
      "name": "string",
      "address": "string",
      "balance": 0,
      "image": "string | null",
      "gradient": "string",
      "createdAt": "2024-01-15T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `500` - Server error

---

### 3. Get Wallets Transaction History

**GET** `/wallets/history`

**Description:** Fetch transaction history for all wallets belonging to the authenticated user

**Headers:**
- `Authorization: Bearer <token>` (required)

**Query Parameters:**
- `limit` (optional) - Number of transactions to return (default: 50, max: 100)
- `offset` (optional) - Number of transactions to skip (default: 0)
- `walletId` (optional) - Filter by specific wallet ID

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "walletId": "string",
      "type": "string (sent | received | swap | other)",
      "amount": "string (e.g., '+0.5 ETH' or '-0.1 ETH')",
      "value": "number (numeric amount)",
      "currency": "string (e.g., 'ETH', 'USDC')",
      "to": "string (recipient address)",
      "from": "string (sender address)",
      "txHash": "string (transaction hash)",
      "status": "string (pending | completed | failed)",
      "date": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 100,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `500` - Server error

---

### 4. Get Single Wallet

**GET** `/wallet/{id}`

**Description:** Fetch a specific wallet by ID

**Headers:**
- `Authorization: Bearer <token>` (required)

**Parameters:**
- `id` (path parameter) - Wallet ID

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "string",
    "userId": "string",
    "name": "string",
    "address": "string",
    "balance": 0,
    "image": "string | null",
    "gradient": "string",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `404` - Wallet not found
- `403` - Forbidden (wallet belongs to another user)
- `500` - Server error

**Security Note:**
- Ensure the wallet belongs to the authenticated user before returning data

---

### 5. Get Wallet Balance

**GET** `/wallet/{id}/balance`

**Description:** Get the current balance for a specific wallet

**Headers:**
- `Authorization: Bearer <token>` (required)

**Parameters:**
- `id` (path parameter) - Wallet ID

**Response:**

```json
{
  "success": true,
  "data": {
    "walletId": "string",
    "address": "string",
    "balance": 1.25,
    "currency": "ETH",
    "usdValue": 3125.50,
    "lastUpdated": "2024-01-15T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Success
- `401` - Unauthorized (invalid or missing token)
- `404` - Wallet not found
- `403` - Forbidden (wallet belongs to another user)
- `500` - Server error

**Notes:**
- Balance should be fetched from the blockchain (via Web3 provider or indexing service)
- Consider caching balance data with a short TTL (e.g., 30 seconds) to reduce blockchain calls
- `usdValue` is optional but recommended for better UX

---

### 6. Update Wallet

**PUT** `/wallet/{id}`

**Description:** Update wallet details (name, image, gradient)

**Headers:**
- `Authorization: Bearer <token>` (required)
- `Content-Type: application/json` (or `multipart/form-data` if uploading image)

**Parameters:**
- `id` (path parameter) - Wallet ID

**Request Body:**

```json
{
  "name": "string (optional) - Wallet name",
  "image": "string (optional) - Image URL or base64. Set to null to remove image",
  "gradient": "string (optional) - CSS gradient string"
}
```

**Note:** All fields are optional. Only include the fields you want to update. To remove an image, set `image` to `null`.

**Response:**

```json
{
  "success": true,
  "message": "Wallet updated successfully",
  "data": {
    "_id": "string",
    "userId": "string",
    "name": "string",
    "address": "string",
    "balance": 0,
    "image": "string | null",
    "gradient": "string",
    "createdAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Updated successfully
- `400` - Validation error (invalid field values, etc.)
- `401` - Unauthorized (invalid or missing token)
- `404` - Wallet not found
- `403` - Forbidden (wallet belongs to another user)
- `500` - Server error

**Validation Rules:**
- `name`: Optional, string, min 1 character, max 100 characters (if provided)
- `image`: Optional, string (URL or base64) or null to remove
- `gradient`: Optional, string (CSS gradient)
- **Note:** The `address` field cannot be updated for security reasons

**Security Note:**
- Ensure the wallet belongs to the authenticated user before allowing updates
- Do not allow updating the wallet address (security risk)

---

## Data Models

### Wallet Schema

```javascript
{
  _id: ObjectId (MongoDB) or String,
  userId: ObjectId/String (required) - Reference to user who owns the wallet,
  name: String (required, min: 1, max: 100),
  address: String (required, unique per user) - Ethereum address,
  balance: Number (default: 0) - Current balance in ETH,
  image: String (optional) - Image URL or base64,
  gradient: String (optional) - CSS gradient string,
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

### Transaction Schema

```javascript
{
  _id: ObjectId (MongoDB) or String,
  walletId: ObjectId/String (required) - Reference to wallet,
  userId: ObjectId/String (required) - Reference to user,
  type: String (required, enum: ["sent", "received", "swap", "other"]),
  amount: String (required) - Display amount (e.g., "+0.5 ETH"),
  value: Number (required) - Numeric amount,
  currency: String (required, default: "ETH"),
  to: String (optional) - Recipient address,
  from: String (optional) - Sender address,
  txHash: String (required) - Transaction hash,
  status: String (required, enum: ["pending", "completed", "failed"], default: "pending"),
  date: Date (required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

---

## Error Response Format

All errors should follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "address",
      "message": "Invalid Ethereum address format"
    }
  ]
}
```

---

## Security Considerations

1. **Authorization**: Always verify that the wallet belongs to the authenticated user before returning data
2. **Address Validation**: Validate Ethereum address format (0x prefix, 42 characters, valid hex)
3. **Rate Limiting**: Consider rate limiting for balance queries to prevent abuse
4. **Balance Caching**: Cache blockchain balance queries to reduce load and improve performance
5. **Input Sanitization**: Sanitize all user inputs to prevent injection attacks

---

## Implementation Notes

1. **Balance Fetching**: 
   - Use a Web3 provider (Infura, Alchemy, etc.) or blockchain indexing service (The Graph, Moralis, etc.)
   - Consider using a service like Moralis or Alchemy for easier balance queries
   - Cache balances with short TTL (30-60 seconds)

2. **Transaction History**:
   - Can be fetched from blockchain indexers or stored in database
   - If storing in DB, sync with blockchain events
   - Consider pagination for large transaction lists

3. **Address Uniqueness**:
   - A wallet address can be associated with multiple users (different wallets)
   - But each user should have unique wallet addresses (no duplicates per user)

4. **Database Indexing**:
   - Index `userId` for fast wallet queries
   - Index `address` for balance lookups
   - Index `walletId` and `date` for transaction history queries
