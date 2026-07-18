# Soltane Stationery

Soltane Stationery is a modern e-commerce experience for stationery and lifestyle products, built with a React-based storefront and a Node.js/Express/MongoDB backend. The platform includes a polished shopping experience, bilingual support, cart and checkout flows, an admin dashboard, and analytics for business insights.

## ✨ Features

- Responsive storefront with animated landing sections
- Product catalog, search, filters, and product detail pages
- Shopping cart, shipping and checkout flow
- User authentication, profile management, and order tracking
- Admin dashboard for products, users, orders, categories, and analytics
- Bilingual UI support for English and Arabic
- Integration-ready backend for payments, coupons, contact forms, and uploads

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- React Router DOM
- Redux Toolkit + RTK Query
- Tailwind CSS
- Framer Motion, GSAP, i18next, Chart.js

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT authentication
- Cloudinary and Multer for image upload

## 📁 Project Structure

- `src/` — frontend React application and screens
- `server/` — backend API, routes, models, and database configuration
- `public/` — static assets and media files
- `tailwind.config.js` — Tailwind configuration
- `vite.config.js` — Vite configuration with API proxying

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js 18 or newer
- npm
- MongoDB instance

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server/` directory and provide the required values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 4. Run the application

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a separate terminal:

```bash
npm run dev
```

Open your browser at:

```text
http://localhost:5173
```

## 🌱 Seed Demo Data

To populate the database with sample categories, products, and users:

```bash
cd server
npm run data:import
```

Default demo admin credentials are defined in the seed data:

```text
Email: admin@example.com
Password: 123456
```

## 📦 Available Scripts

### Root project
- `npm run dev` — start the Vite development server
- `npm run build` — build the frontend for production
- `npm run preview` — preview the production build locally

### Server
- `npm run dev` — start the backend with nodemon
- `npm run start` — start the backend normally
- `npm run data:import` — seed the database
- `npm run data:destroy` — remove seeded data

## 🧪 Build for Production

```bash
npm run build
```

## 🤝 Contributing

Contributions are welcome. If you would like to improve the project, please fork the repository, create a feature branch, and submit a pull request.

## 📄 License

This project is licensed under the ISC license.
