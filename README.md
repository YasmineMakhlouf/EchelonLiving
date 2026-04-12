# EchelonLiving

EchelonLiving is a full-stack furniture e-commerce platform with a React frontend, an Express + TypeScript backend, and a PostgreSQL database. It supports product browsing, filtering, cart and orders, admin management, and a custom Design Studio flow for customer submissions.

## Project Structure

- `api/` backend API, database scripts, migrations, and uploads
- `app/` frontend single-page app

## Architecture

### Backend

- Controllers handle HTTP requests and responses
- Services hold business rules and orchestration
- Repositories handle SQL and persistence
- Validators protect request payloads
- Middleware handles authentication, roles, async errors, uploads, and error responses

### Frontend

- Pages define the main route screens
- Components provide reusable UI building blocks
- Context manages auth session state
- Hooks synchronize catalog updates in realtime
- API modules centralize backend requests

## Tech Stack

### Backend

- Node.js
- Express 5
- TypeScript
- PostgreSQL with `pg`
- JWT authentication
- `bcrypt` for password hashing
- `express-validator` for request validation
- `multer` for product image uploads
- `cors` and `dotenv`
- `helmet` and `express-rate-limit` for security hardening
- `nodemailer` for email workflows if enabled in the project

### Frontend

- React 19
- Vite 8
- TypeScript
- React Router
- Axios
- `tsparticles` and `@tsparticles/react` for animated visuals

### Tools

- TypeScript compiler
- `ts-node-dev` for backend development
- PM2 for production process management
- ESLint for frontend linting
- Vitest for frontend and backend automated tests
- GitHub Actions CI for lint/build/test checks

## Prerequisites

- Node.js 20+
- npm 10+
- PostgreSQL 14+

## Environment Setup

Create the backend env file:

```powershell
copy api\.env.example api\.env
```

Required backend values in `api/.env`:

- `DB_HOST`
- `DB_PORT` default `5432`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`

Optional backend values:

- `PORT` default `5000`
- `FRONTEND_URL` default `http://localhost:5173` and supports comma-separated origins
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Create the frontend env file if you want to override the default API URL:

```powershell
copy app\.env.example app\.env
```

Frontend value:

- `VITE_API_BASE_URL` default `http://localhost:5000/api/v1`

## Local Setup

### 1. Install dependencies

```powershell
cd api
npm install
cd ..\app
npm install
```

### 2. Initialize the database

From `api/`:

```powershell
npx ts-node init-db.ts
```

### 3. Run migrations when needed

From `api/`:

```powershell
npx ts-node migrate-db.ts
```

If you are upgrading an older cart schema, also run:

```powershell
npx ts-node migrate-cart-items-user-id.ts
```

### 4. Seed demo users optional

From `api/`:

```powershell
npx ts-node create-admin.ts
npx ts-node create-test-customer.ts
```

Default demo credentials:

- Admin: `admin@example.com` / `admin123`
- Customer: `customer@example.com` / `customer123`

### 5. Start the backend

From `api/`:

```powershell
npm run dev
```

Backend URLs:

- API root: `http://localhost:5000/`
- API base: `http://localhost:5000/api/v1`

### 6. Start the frontend

From `app/`:

```powershell
npm run dev
```

Frontend URL:

- App: `http://localhost:5173`

## Production Build

### Backend

From `api/`:

```powershell
npm run build
npm start
```

### Frontend

From `app/`:

```powershell
npm run build
npm run serve:static
```

## How To Test

Run automated tests:

```powershell
cd api
npm test
cd ..\app
npm run test:run
```

Then perform smoke testing in the browser:

1. Register or log in.
2. Browse products and categories.
3. Add items to cart.
4. Place an order.
5. Open the design studio and submit a design request.
6. Log in as admin and review products, categories, users, stats, and design requests.

Run lint and builds:

```powershell
cd app
npm run lint
npm run build
cd ..\api
npm run build
```

## Security Measures

- JWT authentication and role-based authorization middleware
- Request payload validation with `express-validator`
- Global error handling with structured responses
- Rate limiting:
	- General API limiter on `/api/v1`
	- Stricter auth limiter on `/api/v1/auth`
- Security headers via `helmet`
- CORS origin allowlist via environment configuration

## Continuous Integration

CI workflow file: `.github/workflows/ci.yml`

On each push and pull request:

- Frontend: install, lint, build, test
- Backend: install, build, test

## API Endpoints

All routes are mounted under `/api/v1`.

### Auth

- `POST /auth/login` login and receive JWT
- `POST /auth/register` create a customer account

### Users

- `GET /users` list users
- `GET /users/:id` get a single user
- `POST /users` create a user
- `PUT /users/:id` update a user
- `DELETE /users/:id` delete a user

### Products

- `GET /products` list products with filters
- `GET /products/:id` get product details
- `GET /products/:id/images` list product images
- `POST /products` create product admin only
- `POST /products/:id/images` upload product image admin only
- `PUT /products/:id` update product admin only
- `DELETE /products/:id` delete product admin only

### Categories

- `GET /categories` list categories
- `GET /categories/:id` get category details
- `POST /categories` create category admin only
- `PUT /categories/:id` update category admin only
- `DELETE /categories/:id` delete category admin only

### Reviews

- `GET /reviews` list reviews
- `GET /reviews/:id` get review details
- `POST /reviews` create review
- `PUT /reviews/:id` update review
- `DELETE /reviews/:id` delete review

### Cart

- `GET /cart-items` get current user cart
- `POST /cart-items` add item to cart
- `PUT /cart-items/:id` update item quantity
- `DELETE /cart-items/:id` remove item

### Orders

- `GET /orders/history` get order history for the current user
- `GET /orders` list the current user orders
- `GET /orders/:id` get a single order
- `POST /orders` create an order from cart

### Order Items

- `GET /order-items/order/:orderId` list items for one order

### Admin

- `GET /admin/stats` dashboard summary

### Design Requests

- `POST /design-requests` submit a design request
- `GET /design-requests` list requests admin only
- `PATCH /design-requests/:id` update status and admin notes admin only

### Realtime Events

- `GET /events/catalog` SSE stream for catalog sync

## Database Schema

The database is initialized by `api/init-db.ts` and extended by migrations when needed.

### `users`

- `id` serial primary key
- `name` varchar not null
- `email` varchar unique not null
- `password` varchar not null
- `role` varchar default `customer`
- `created_at` timestamp default current timestamp

### `categories`

- `id` serial primary key
- `name` varchar unique not null
- `description` text

### `products`

- `id` serial primary key
- `name` varchar not null
- `description` text
- `price` decimal(10,2) not null
- `color` varchar
- `size` varchar
- `stock_quantity` integer default 0
- `category_id` foreign key to `categories.id`
- `created_at` timestamp default current timestamp

### `product_images`

- `id` serial primary key
- `product_id` foreign key to `products.id` with cascade delete
- `image_url` varchar not null
- `created_at` timestamp default current timestamp

### `reviews`

- `id` serial primary key
- `product_id` foreign key to `products.id` with cascade delete
- `user_id` foreign key to `users.id` with cascade delete
- `rating` integer between 1 and 5
- `comment` text
- `created_at` timestamp default current timestamp

### `cart_items`

- `id` serial primary key
- `user_id` foreign key to `users.id` with cascade delete
- `product_id` foreign key to `products.id` with cascade delete
- `quantity` integer default 1
- unique constraint on `user_id` and `product_id`

### `orders`

- `id` serial primary key
- `user_id` foreign key to `users.id` with cascade delete
- `total_price` decimal(10,2) not null
- `created_at` timestamp default current timestamp

### `order_items`

- `id` serial primary key
- `order_id` foreign key to `orders.id` with cascade delete
- `product_id` foreign key to `products.id`
- `quantity` integer not null
- `price` decimal(10,2) not null

### `design_requests`

- `id` serial primary key
- `user_id` foreign key to `users.id` with cascade delete
- `title` varchar not null
- `notes` text
- `design_data_url` text not null
- `status` varchar default `pending`
- `admin_notes` text
- `created_at` timestamp default current timestamp
- `reviewed_at` timestamp

### Schema Notes

- `migrate-db.ts` adds `product_images.created_at` if it is missing and creates `design_requests` if needed.
- `migrate-cart-items-user-id.ts` supports older cart schemas that needed `user_id` backfilled.
- Some repositories support legacy column names for backward compatibility during upgrades.

## Third-Party Libraries and Tools

### Backend

- `express` HTTP server and routing
- `cors` cross-origin access
- `pg` PostgreSQL client
- `dotenv` environment loading
- `jsonwebtoken` JWT creation and verification
- `bcrypt` password hashing
- `express-validator` request validation
- `multer` file uploads
- `nodemailer` email delivery
- `ts-node-dev` live TypeScript development

### Frontend

- `react` UI library
- `react-dom` DOM rendering
- `react-router-dom` client routing
- `axios` HTTP client
- `tsparticles`, `@tsparticles/react`, `tsparticles-engine`, `tsparticles-slim` visual effects

### Build and Quality Tools

- TypeScript compiler
- Vite
- ESLint
- PM2

## File Uploads and Static Assets

- Product image uploads are stored under `api/uploads/products`.
- The API serves uploaded files from `/uploads`.

## Troubleshooting

### `npm run dev` fails with missing `package.json`

Run the command from the correct folder: `api/` for backend or `app/` for frontend.

### Frontend cannot reach backend

- Confirm `VITE_API_BASE_URL` points to `http://localhost:5000/api/v1`
- Confirm the API is running at `http://localhost:5000/`

### CORS errors

- Add the frontend origin to `FRONTEND_URL` in `api/.env`
- Separate multiple origins with commas

### Design request submission fails

- Run `npx ts-node migrate-db.ts`
- Restart the backend after the migration

### API errors after schema changes

- Re-run the relevant migration script
- Restart the backend server
