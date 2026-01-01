# Tasks API Endpoints

This document outlines the API endpoints required for the Tasks feature.

## Base URL

```
/api/tasks
```

## Endpoints

### 1. Get All Tasks

**GET** `/api/tasks`

**Description:** Fetch all tasks (no authentication required)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "status": "string (ongoing, completed, archived)",
      "startDate": "2024-01-15T00:00:00.000Z",
      "completionDate": "2024-01-20T00:00:00.000Z",
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-10T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**

- `200` - Success
- `500` - Server error

---

### 2. Get Single Task

**GET** `/api/tasks/:id`

**Description:** Fetch a single task by ID (no authentication required)

**Parameters:**

- `id` (path parameter) - Task ID

**Response:**

```json
{
  "success": true,
  "data": {
      "_id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "startDate": "2024-01-15T00:00:00.000Z",
    "completionDate": "2024-01-20T00:00:00.000Z",
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-10T00:00:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Success
- `404` - Task not found
- `500` - Server error

---

### 3. Create Task

**POST** `/api/tasks`

**Description:** Create a new task (no authentication required)

**Request Body:**

```json
{
  "title": "string (required)",
  "description": "string (optional)",
  "status": "string (optional) - Default: 'ongoing'. Values: 'ongoing', 'completed', 'archived'",
  "startDate": "2024-01-15T00:00:00.000Z (required) - ISO date string",
  "completionDate": "2024-01-20T00:00:00.000Z (required) - ISO date string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
      "_id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "startDate": "2024-01-15T00:00:00.000Z",
    "completionDate": "2024-01-20T00:00:00.000Z",
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-10T00:00:00.000Z"
  }
}
```

**Status Codes:**

- `201` - Created successfully
- `400` - Validation error (missing required fields, invalid dates, etc.)
- `500` - Server error

**Validation Rules:**

- `title`: Required, string, min 1 character, max 200 characters
- `description`: Optional, string, max 2000 characters
- `startDate`: Required, valid ISO date string
- `completionDate`: Required, valid ISO date string, must be after startDate

---

### 4. Update Task

**PUT** `/api/tasks/:id`

**Description:** Update an existing task (no authentication required)

**Parameters:**

- `id` (path parameter) - Task ID

**Request Body:**

```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "status": "string (optional) - Values: 'ongoing', 'completed', 'archived'",
  "startDate": "2024-01-15T00:00:00.000Z (optional) - ISO date string",
  "completionDate": "2024-01-20T00:00:00.000Z (optional) - ISO date string"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
      "_id": "string",
      "title": "string",
      "description": "string",
      "status": "string",
      "startDate": "2024-01-15T00:00:00.000Z",
    "completionDate": "2024-01-20T00:00:00.000Z",
    "createdAt": "2024-01-10T00:00:00.000Z",
    "updatedAt": "2024-01-10T00:00:00.000Z"
  }
}
```

**Status Codes:**

- `200` - Updated successfully
- `400` - Validation error
- `404` - Task not found
- `500` - Server error

**Validation Rules:**

- Same as Create Task, but all fields are optional
- If both `startDate` and `completionDate` are provided, `completionDate` must be after `startDate`

---

### 5. Delete Task

**DELETE** `/api/tasks/:id`

**Description:** Delete a task (no authentication required)

**Parameters:**

- `id` (path parameter) - Task ID

**Response:**

```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

**Status Codes:**

- `200` - Deleted successfully
- `404` - Task not found
- `500` - Server error

---

## Data Model

### Task Schema

```javascript
{
  _id: ObjectId (MongoDB) or String,
  title: String (required, min: 1, max: 200),
  description: String (optional, max: 2000),
  status: String (optional, default: "ongoing", enum: ["ongoing", "completed", "archived"]),
  startDate: Date (required),
  completionDate: Date (required),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-updated)
}
```

## Notes

1. **No Authentication Required:** All endpoints are public and do not require authentication tokens.

2. **Date Format:** All dates should be in ISO 8601 format (e.g., `2024-01-15T00:00:00.000Z`).

3. **Error Response Format:**

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "title",
      "message": "Title is required"
    }
  ]
}
```

4. **Date Validation:**

   - `completionDate` must be equal to or after `startDate`
   - Both dates should be valid future or past dates

6. **Pagination (Optional):** If you want to add pagination later:
   - Query params: `?page=1&limit=10`
   - Response should include: `total`, `page`, `limit`, `totalPages`
