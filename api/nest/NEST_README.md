# EchelonLiving API (NestJS)

This is the NestJS backend API for the EchelonLiving furniture e-commerce platform. It follows NestJS modularity best practices with a clean separation of concerns: controllers handle HTTP requests, services contain business logic, and repositories manage database access.

## Table of Contents

- [Project Setup](#project-setup)
- [Tech Stack](#tech-stack)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Technical Documentation](#technical-documentation)

---

## Project Setup

### Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

### Installation

```bash
cd api/nest
npm install --legacy-peer-deps
```

### Environment Configuration

Create or update a `.env` file in the `api/nest` directory with the following variables:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=echelon
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5001
```

**Environment Variables:**

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | PostgreSQL server hostname |
| `DB_PORT` | 5432 | PostgreSQL server port |
| `DB_NAME` | echelon | Database name |
| `DB_USER` | postgres | Database user |
| `DB_PASSWORD` | *(required)* | Database user password |
| `PORT` | 5001 | Port the NestJS app listens on |

---

## Tech Stack

### Core Frameworks

- **NestJS 10.0** — Progressive Node.js framework for building scalable server-side applications
- **Node.js** — JavaScript runtime
- **TypeScript 5.2** — Typed superset of JavaScript
- **Express 5** — HTTP server (via NestJS platform)

### Database & ORM

- **PostgreSQL** — Relational database
- **pg 8.20** — Node.js PostgreSQL client

### Utilities & Validation

- **class-validator 0.15** — Validation decorators for DTOs
- **class-transformer 0.5** — Object transformation library
- **@nestjs/config 3.0** — Environment and config management
- **@nestjs/swagger 6.0** — Swagger/OpenAPI documentation generator
- **reflect-metadata 0.1** — Metadata reflection for decorators

### Development Tools

- **ts-node-dev 2.0** — Development server with auto-reload
- **TypeScript** — Type checking during development and build

---

## Database Schema

The application uses the following core PostgreSQL tables (see `echelon_living.sql` in the repo root for the full schema):

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'customer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Store user accounts with role-based access control (customer, admin).

### Products Table

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Store furniture product catalog with pricing and categorization.

### Categories Table

```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Organize products by category (e.g., "Sofas", "Chairs", "Tables").

### Orders Table

```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Track customer orders with status (pending, completed, cancelled).

### Order Items Table

```sql
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

**Purpose:** Line items within an order.

### Cart Items Table

```sql
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER DEFAULT 1
);
```

**Purpose:** Store shopping cart contents per user.

### Reviews Table

```sql
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  user_id INTEGER NOT NULL REFERENCES users(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Customer ratings and feedback on products.

### Product Images Table

```sql
CREATE TABLE product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  url VARCHAR(255) NOT NULL,
  caption VARCHAR(255)
);
```

**Purpose:** Store multiple images per product.

### Design Requests Table

```sql
CREATE TABLE design_requests (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  details TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Track custom design/consultation requests from customers.

### Catalog Events Table

```sql
CREATE TABLE catalog_events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Purpose:** Announcements, sales events, and product launches.

---

## Project Structure

```
api/nest/
├── src/
│   ├── main.ts                           # Application bootstrap
│   ├── app.module.ts                     # Root application module
│   ├── common/
│   │   └── swagger.ts                    # Swagger/OpenAPI setup
│   ├── config/
│   │   ├── database.provider.ts          # PostgreSQL pool configuration
│   │   └── database.module.ts            # Global database module
│   └── modules/
│       ├── admin-stats/
│       │   ├── admin-stats.module.ts
│       │   ├── admin-stats.controller.ts
│       │   ├── admin-stats.service.ts
│       │   └── admin-stats.repository.ts
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   └── auth.repository.ts
│       ├── user/
│       ├── product/
│       ├── category/
│       ├── order/
│       ├── cart-item/
│       ├── review/
│       ├── product-image/
│       ├── design-request/
│       └── catalog-events/
├── dist/                                 # Compiled JavaScript output
├── package.json
├── tsconfig.json
└── README.md
```

**Key Principles:**

- **Modularity:** Each feature (products, orders, auth) is a self-contained module with its own controller, service, and repository.
- **Separation of Concerns:** 
  - **Controllers** handle HTTP requests/responses
  - **Services** contain business logic
  - **Repositories** manage database queries
- **Global Database Module:** The `DatabaseModule` exports the PostgreSQL pool globally so all repositories can access it.

---

## API Endpoints

All endpoints are prefixed with `/api/v1` when deployed with the Express frontend wrapper.  
For direct Nest app access at `http://localhost:5001`:

### Admin Stats

**`GET /admin/stats`**

Retrieve key performance indicators (KPIs) for the admin dashboard.

**Response:**
```json
{
  "total_users": 42,
  "total_orders": 156,
  "top_selling_products": [
    {
      "product_id": 5,
      "product_name": "Sectional Sofa",
      "total_sold": 24
    }
  ]
}
```

---

### Authentication

**`POST /auth/login`**

Authenticate a user with email and password.

**Request Body:**
```json
{
  "email": "customer@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "customer@example.com",
  "role": "customer"
}
```

**`POST /auth/register`**

Create a new user account.

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepassword123",
  "role": "customer"
}
```

**Response:**
```json
{
  "id": 2,
  "email": "newuser@example.com",
  "role": "customer"
}
```

---

### Users

**`GET /users`**

List all users (limit 100).

**Response:**
```json
[
  {
    "id": 1,
    "email": "admin@example.com",
    "role": "admin"
  },
  {
    "id": 2,
    "email": "customer@example.com",
    "role": "customer"
  }
]
```

**`GET /users/:id`**

Retrieve a single user by ID.

**Parameters:**
- `id` (path, integer) — User ID

**Response:**
```json
{
  "id": 1,
  "email": "admin@example.com",
  "role": "admin"
}
```

---

### Products

**`GET /products`**

List all products (limit 100, ordered newest first).

**Response:**
```json
[
  {
    "id": 5,
    "name": "Leather Sectional",
    "price": "1299.99",
    "description": "Premium leather sectional sofa"
  }
]
```

**`GET /products/:id`**

Retrieve a single product by ID.

**Parameters:**
- `id` (path, integer) — Product ID

**Response:**
```json
{
  "id": 5,
  "name": "Leather Sectional",
  "price": "1299.99",
  "description": "Premium leather sectional sofa"
}
```

---

### Categories

**`GET /categories`**

List all product categories.

**Response:**
```json
[
  { "id": 1, "name": "Sofas" },
  { "id": 2, "name": "Chairs" },
  { "id": 3, "name": "Tables" }
]
```

---

### Orders

**`GET /orders/:id`**

Retrieve an order by ID with all associated items.

**Parameters:**
- `id` (path, integer) — Order ID

**Response:**
```json
{
  "id": 10,
  "user_id": 1,
  "total": "1599.98",
  "status": "completed"
}
```

**`POST /orders`**

Create a new order.

**Request Body:**
```json
{
  "user_id": 1,
  "total": "1599.98",
  "status": "pending"
}
```

**Response:**
```json
{
  "id": 11,
  "user_id": 1,
  "total": "1599.98",
  "status": "pending"
}
```

---

### Cart Items

**`GET /cart-items/:userId`**

Retrieve all items in a user's shopping cart.

**Parameters:**
- `userId` (path, integer) — User ID

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 2,
    "product_id": 5,
    "quantity": 1
  },
  {
    "id": 2,
    "user_id": 2,
    "product_id": 8,
    "quantity": 2
  }
]
```

**`POST /cart-items`**

Add an item to a user's cart.

**Request Body:**
```json
{
  "user_id": 2,
  "product_id": 5,
  "quantity": 1
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 2,
  "product_id": 5,
  "quantity": 1
}
```

---

### Reviews

**`GET /reviews/:productId`**

Retrieve all reviews for a specific product.

**Parameters:**
- `productId` (path, integer) — Product ID

**Response:**
```json
[
  {
    "id": 1,
    "user_id": 3,
    "rating": 5,
    "comment": "Excellent quality!"
  }
]
```

---

### Product Images

**`GET /product-images/:productId`**

Retrieve all images for a specific product.

**Parameters:**
- `productId` (path, integer) — Product ID

**Response:**
```json
[
  {
    "id": 1,
    "url": "https://example.com/sofa-front.jpg",
    "caption": "Front view"
  }
]
```

---

### Design Requests

**`POST /design-requests`**

Submit a custom design or consultation request.

**Request Body:**
```json
{
  "user_id": 2,
  "details": "I need a custom sectional for my living room. Dimensions: 12ft x 8ft..."
}
```

**Response:**
```json
{
  "id": 1,
  "user_id": 2,
  "details": "I need a custom sectional...",
  "status": "pending"
}
```

---

### Catalog Events

**`GET /events`**

Retrieve all upcoming catalog events (sales, launches, etc.).

**Response:**
```json
[
  {
    "id": 1,
    "title": "Spring Sale 2026",
    "description": "20% off all outdoor furniture",
    "date": "2026-05-15"
  }
]
```

---

## Running the Application

### Development Mode

Start the NestJS development server with auto-recompile:

```bash
cd api/nest
npm run dev
```

The app will start on `http://localhost:5001`.

Logs will show all initialized modules and mapped routes:
```
[Nest] ... LOG [NestFactory] Starting Nest application...
[Nest] ... LOG [InstanceLoader] AppModule dependencies initialized
...
[Nest] ... LOG [RoutesResolver] ProductController {/products}
[Nest] ... Nest application successfully started
NestJS app running on port 5001
```

### Production Build

```bash
cd api/nest
npm run build
npm start
```

The compiled output goes to `dist/`.

---

## Testing

### Manual Testing with cURL

Test the AdminStats endpoint:

```bash
curl http://localhost:5001/admin/stats
```

Test user registration:

```bash
curl -X POST http://localhost:5001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","role":"customer"}'
```

Test listing products:

```bash
curl http://localhost:5001/products
```

### Using Swagger UI

Once running, Swagger documentation is available at:
```
http://localhost:5001/api-docs
```

(Note: Swagger generation has a known limitation with empty routes; it will warn but not block the app from starting.)

---

## Technical Documentation

### AdminStats Module

**File:** `src/modules/admin-stats/admin-stats.service.ts`

**Method: `getSummary()`**

Computes and returns key metrics for the admin dashboard.

```typescript
async getSummary(): Promise<AdminStatsSummary>
```

**Parameters:** None

**Returns:**
```typescript
{
  total_users: number;
  total_orders: number;
  top_selling_products: Array<{
    product_id: number;
    product_name: string;
    total_sold: number;
  }>;
}
```

**Implementation Details:**
- Queries `users` table for count
- Queries `orders` table for count
- Joins `products` and `order_items` tables, groups by product, and returns top 10 by quantity sold

**Query:**
```sql
SELECT p.id as product_id, p.name as product_name, SUM(oi.quantity)::int as total_sold
FROM products p
JOIN order_items oi ON oi.product_id = p.id
GROUP BY p.id, p.name
ORDER BY total_sold DESC
LIMIT 10
```

---

### Auth Module

**File:** `src/modules/auth/auth.service.ts`

**Method: `login(email: string, password: string)`**

Authenticates a user and returns basic user info.

```typescript
async login(email: string, password: string): Promise<UserDto | null>
```

**Parameters:**
- `email` (string) — User email address
- `password` (string) — User password (plaintext in current implementation)

**Returns:**
```typescript
{
  id: number;
  email: string;
  role: string;
} | null
```

**TODO:** Current implementation does not verify password hashes. Production version should use bcrypt for secure password comparison.

---

**Method: `register(payload: any)`**

Creates a new user account.

```typescript
async register(payload: { email: string; password: string; role?: string }): Promise<User>
```

**Parameters:**
- `payload.email` (string) — User email
- `payload.password` (string) — User password
- `payload.role` (optional string, default: "customer") — User role (admin, customer, etc.)

**Returns:**
```typescript
{
  id: number;
  email: string;
  role: string;
}
```

**Implementation:** Inserts new row into `users` table and returns the created user.

**TODO:** Password hashing with bcrypt before storage.

---

### User Module

**File:** `src/modules/user/users.service.ts`

**Method: `list()`**

Retrieves all users (paginated, max 100).

```typescript
async list(): Promise<User[]>
```

**Returns:** Array of user objects with id, email, role.

---

**Method: `getById(id: number)`**

Retrieves a single user by ID.

```typescript
async getById(id: number): Promise<User | null>
```

**Parameters:**
- `id` (integer) — User ID

**Returns:** User object or null if not found.

---

### Product Module

**File:** `src/modules/product/product.service.ts`

**Method: `list()`**

Retrieves all products (paginated, max 100, newest first).

```typescript
async list(): Promise<Product[]>
```

**Returns:** Array of product objects.

---

**Method: `getById(id: number)`**

Retrieves a single product by ID.

```typescript
async getById(id: number): Promise<Product | null>
```

**Parameters:**
- `id` (integer) — Product ID

**Returns:** Product object or null if not found.

---

### Order Module

**File:** `src/modules/order/order.service.ts`

**Method: `getById(id: number)`**

Retrieves an order with all details by ID.

```typescript
async getById(id: number): Promise<Order | null>
```

**Parameters:**
- `id` (integer) — Order ID

**Returns:** Order object or null if not found.

---

**Method: `create(payload: { user_id: number; total: number; status?: string })`**

Creates a new order.

```typescript
async create(payload: CreateOrderDto): Promise<Order>
```

**Parameters:**
- `payload.user_id` (number) — ID of the user placing the order
- `payload.total` (number) — Total order amount
- `payload.status` (optional string, default: "pending") — Order status

**Returns:** Created order object with ID.

---

### Cart Item Module

**File:** `src/modules/cart-item/cart-item.service.ts`

**Method: `listForUser(userId: number)`**

Retrieves all cart items for a specific user.

```typescript
async listForUser(userId: number): Promise<CartItem[]>
```

**Parameters:**
- `userId` (number) — User ID

**Returns:** Array of cart items.

---

**Method: `add(payload: { user_id: number; product_id: number; quantity?: number })`**

Adds an item to a user's cart.

```typescript
async add(payload: AddCartItemDto): Promise<CartItem>
```

**Parameters:**
- `payload.user_id` (number) — User ID
- `payload.product_id` (number) — Product ID
- `payload.quantity` (optional number, default: 1) — Quantity

**Returns:** Created or updated cart item.

---

### Database Repository Pattern

All modules follow the same repository pattern. Each repository has a single `query()` method:

```typescript
async query(text: string, params?: any[]): Promise<any[]>
```

**Parameters:**
- `text` (string) — SQL query with placeholders ($1, $2, etc.)
- `params` (optional array) — Query parameters

**Returns:** Array of result rows

**Example:**
```typescript
const result = await this.repo.query(
  'SELECT * FROM products WHERE id = $1',
  [productId]
);
```

This ensures all database access goes through the shared PostgreSQL pool managed by `DatabaseModule`.

---

## Next Steps

1. **Add JWT Authentication:** Implement JWT token generation in `auth.service.ts` and create auth guards for protected routes.
2. **Add Validation DTOs:** Use `class-validator` decorators on request DTOs for input validation.
3. **Error Handling:** Add global exception filters and typed error responses.
4. **GraphQL:** Add `@nestjs/graphql` and port queries/mutations for the course requirement.
5. **Frontend Integration:** Connect React frontend to these endpoints via the Vite development server.

---

## References

- [NestJS Documentation](https://docs.nestjs.com/)
- [PostgreSQL Client (pg)](https://node-postgres.com/)
- [Swagger/OpenAPI](https://swagger.io/)
- [Class Validator](https://github.com/typestack/class-validator)

