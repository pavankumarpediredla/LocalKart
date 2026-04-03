# LocalKart

LocalKart is a full-stack e-commerce platform built for local shops. It provides role-based dashboards for admins, sellers, and customers to manage users, products, pricing, promotions, orders, and marketplace operations from a single application.

## Project Structure

- `frontend/e-commerce-app` - React 19 + Vite + Tailwind CSS frontend
- `backend/commerce/commerce` - Spring Boot backend with MySQL and optional Firebase Storage integration

## Current Features

### Frontend

- Role-based login flow
- Customer dashboard
- Admin dashboard with separate pages for:
  - overview
  - create user
  - update user
  - analytics
  - customer search
  - support
  - account
- Seller dashboard with separate pages for:
  - overview
  - add product
  - update/search product
  - pricing
  - coupons
  - promotions
  - orders
  - shipment tracking
  - account
  - settings
- Responsive sidebar navigation for admin and seller modules

### Backend

- Spring Boot REST API
- MySQL persistence with Spring Data JPA
- Role-based users:
  - `ADMIN`
  - `CUSTOMER`
  - `BUYER`
  - `SELLER`
  - `SUPPORT`
- Bootstrap admin and customer user creation
- Product create/list API
- Validation error handling with structured responses
- Optional Firebase Storage support for product image uploads

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router

### Backend

- Spring Boot
- Spring Data JPA
- MySQL
- Firebase Admin SDK
- Maven

## Prerequisites

- Node.js 18+
- npm
- Java 21
- MySQL 8+

## Frontend Setup

From the frontend app root:

```bash
cd frontend/e-commerce-app
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## Backend Setup

From the backend app root:

```bash
cd backend/commerce/commerce
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd backend/commerce/commerce
.\mvnw.cmd spring-boot:run
```

## Backend Configuration

The backend is environment-driven. Important properties include:

```properties
SERVER_PORT=8080
DB_URL=jdbc:mysql://localhost:3306/commerce_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
DB_USERNAME=your_mysql_username
DB_PASSWORD=your_mysql_password
JPA_DDL_AUTO=update
JPA_SHOW_SQL=true

FIREBASE_ENABLED=false
FIREBASE_BUCKET_NAME=
FIREBASE_CREDENTIALS_PATH=

BOOTSTRAP_ADMIN_USERNAME=admin
BOOTSTRAP_ADMIN_PASSWORD=change-me
BOOTSTRAP_ADMIN_FULL_NAME=Platform Admin
BOOTSTRAP_ADMIN_EMAIL=admin@localkart.com

BOOTSTRAP_CUSTOMER_USERNAME=testCustomer
BOOTSTRAP_CUSTOMER_PASSWORD=change-me
BOOTSTRAP_CUSTOMER_FULL_NAME=Default Customer
BOOTSTRAP_CUSTOMER_EMAIL=customer@localkart.com
```

## Firebase Notes

Firebase is optional. Keep it disabled until you have a Firebase service account JSON file.

If you want image uploads through Firebase Storage, set:

```properties
FIREBASE_ENABLED=true
FIREBASE_BUCKET_NAME=your-project-id.appspot.com
FIREBASE_CREDENTIALS_PATH=C:/path/to/firebase-service-account.json
```

If these values are missing while Firebase is enabled, backend startup will fail.

## Default Local Flow

1. Start MySQL.
2. Run the backend from `backend/commerce/commerce`.
3. Run the frontend from `frontend/e-commerce-app`.
4. Log in and navigate by role:
   - admin -> admin dashboard
   - seller -> seller dashboard
   - customer/buyer -> customer dashboard

## Notes

- Do not commit `.idea/`.
- Do not commit `frontend/package-lock.json`; the real frontend app is inside `frontend/e-commerce-app`.
- The backend currently targets Java 21.

