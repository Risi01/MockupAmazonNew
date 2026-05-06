# Mock Amazon Project New

## Overview

MockAmazon is a mock Amazon-style e-commerce web application developed for CMPS480.

The project demonstrates frontend development, backend API integration, database design, filtering systems, analytics features, and deployment.

Technologies used:

- React + Vite
- Node.js + Express
- MySQL
- GitHub
- FileZilla deployment to Point Park jail server


## Live Deployment

Frontend Deployment:

http://mgajic.it.pointpark.edu/CMPS480/module7b/

GitHub Repository:

https://github.com/Risi01/MockupAmazonNew

## Features

### Customer Features
- Product browsing
- Product search
- Category filtering
- Price filtering
- Sorting products
- Shopping cart system
- Add/remove cart items
- Dynamic cart counter
- Responsive interface

### Business Features
- Business analytics dashboard
- Revenue calculations
- Top-selling product tracking
- Units sold tracking
- Product performance table

### UI Features
- Dark mode / Light mode toggle
- Amazon-inspired layout
- Product cards with ratings
- Slide-out shopping cart

## Database

The database was designed using MySQL Workbench.

Included database components:

- Users table
- Products table
- Orders table
- OrderItems table
- CartItems table
- Foreign key relationships
- SQL queries and joins

SQL file location:

```bash
docs/database-implementation.sql
```

## How to Run Locally

### Backend

```bash
cd server
npm install
node index.js
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Project Structure

```bash
client/     -> React frontend
server/     -> Express backend
docs/       -> SQL and database files
```
