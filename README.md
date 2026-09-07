# BulldogEx Shop

BulldogEx Shop is a full-stack e-commerce web application developed using React, Node.js, Express.js, and MongoDB.

The system allows customers to browse products, view product details, add products to their shopping cart, place orders, submit product reviews, and manage their account.

The system also provides management functions for administrators and sellers. Administrators can manage users, products, categories, orders, and reviews, while sellers can manage their products and access order-related functions.

The application uses a React frontend connected to an Express.js backend through REST APIs. MongoDB Atlas is used as the database, while JWT authentication and role-based access control are implemented to protect restricted resources.

---

## Features

### Customer Features

Customers can:

- Register an account
- Login and logout
- Browse products
- Search products
- Filter products by category
- View product details
- View product reviews
- Add products to cart
- Update cart quantities
- Remove products from cart
- Clear the shopping cart
- Checkout products
- Provide a shipping address
- Select a payment method
- View order history
- View order details
- Cancel pending orders
- Submit product reviews
- Update their reviews
- Delete their reviews
- View their profile
- Update profile information
- Change account password

### Seller Features

Sellers can:

- Login and logout
- Access the seller dashboard
- View products
- Create products
- Update products
- Delete products
- View seller-related orders
- Manage order status
- View seller-related reviews

### Admin Features

Administrators can:

- Login and logout
- Access the admin dashboard
- View all users
- View individual users
- Manage user information
- Manage user roles
- Manage products
- Create products
- Update products
- Delete products
- Manage categories
- View all orders
- Update orders
- Delete orders
- Manage reviews
- Access administrative dashboard information

---

## Technologies Used

### Frontend

- React
- Vite
- JavaScript
- React Router
- Axios
- Tailwind CSS
- Material UI
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- MongoDB Atlas
- Mongoose
- JSON Web Token
- bcryptjs
- CORS
- dotenv

### Development and Testing Tools

- Visual Studio Code
- Git
- GitHub
- Postman
- npm
- Nodemon
- MongoDB Atlas

---

## Libraries and Packages Used

The project uses different libraries and packages to support the frontend interface, API communication, database operations, authentication, authorization, styling, and development.

### React

React is the main frontend library used to build the BulldogEx Shop user interface.

The application is divided into reusable components and pages. This makes the interface easier to maintain because common elements can be reused throughout the application.

### Vite

Vite is used as the frontend development and build tool.

It provides a development server for running the React application locally and builds the application for production.

### React Router

React Router is used for client-side navigation.

It allows the application to navigate between pages such as:

```text
/
 /products
/products/:id
/cart
/orders
/reviews
/profile
````

It also allows protected application areas such as the dashboard to be handled through frontend routing.

### Axios

Axios is used to communicate between the React frontend and Express backend.

The project separates API communication into service files:

```text
ProductService.js
CategoryService.js
CartService.js
OrderService.js
ReviewService.js
UserService.js
```

These services send HTTP requests to the backend using methods such as:

```text
GET
POST
PUT
PATCH
DELETE
```

For protected requests, Axios sends the JWT using the Authorization header.

Example:

```http
Authorization: Bearer <token>
```

### Tailwind CSS

Tailwind CSS is used to style the React frontend.

It is used for:

* Page layouts
* Responsive designs
* Buttons
* Forms
* Cards
* Navigation
* Colors
* Spacing
* Typography
* Dashboard interfaces

### Material UI

Material UI is used for additional user interface components.

The project uses Material UI components for dashboard interfaces, tables, ratings, dialogs, typography, and other administrative interface elements.

### Lucide React

Lucide React provides icons used throughout the application.

Icons are used in areas such as:

* Navigation
* Dashboard
* Products
* Orders
* Reviews
* Users
* Cart
* Account management

### Node.js

Node.js is the runtime environment used to execute the backend JavaScript application.

It allows Express.js and the other backend packages to run on the server.

### Express.js

Express.js is used to create the REST API.

It handles:

* API routes
* HTTP requests
* HTTP responses
* Middleware
* Authentication
* Authorization
* Error handling

### MongoDB

MongoDB is the NoSQL database used by BulldogEx Shop.

The database stores:

```text
Users
Products
Categories
Carts
Orders
Reviews
```

### MongoDB Atlas

MongoDB Atlas hosts the MongoDB database in the cloud.

The backend connects to MongoDB Atlas using a MongoDB connection string stored in an environment variable.

### Mongoose

Mongoose is used as the Object Data Modeling (ODM) library for MongoDB.

It is responsible for:

* Creating schemas
* Validating data
* Creating models
* Querying MongoDB
* Updating documents
* Deleting documents
* Populating related documents

The project contains the following main models:

```text
userModel.js
productModel.js
categoryModel.js
cartModel.js
orderModel.js
reviewModel.js
```

### JSON Web Token

The `jsonwebtoken` package is used to implement authentication.

After successful login, the backend generates a JWT containing information about the authenticated user.

The frontend stores the token and sends it with protected API requests.

The backend then verifies the token using the authentication middleware.

### bcryptjs

bcryptjs is used to hash user passwords before storing them in MongoDB.

This prevents user passwords from being stored as plain text.

### CORS

CORS allows the React frontend and Express backend to communicate when they are running on different ports or origins.

During development, the frontend and backend run separately, so CORS is required to allow communication between them.

### dotenv

dotenv loads environment variables from the `.env` file.

The project uses environment variables for sensitive configuration such as:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SALT=10
PORT=8000
```

These values should not be committed to GitHub.

### Nodemon

Nodemon automatically restarts the backend server when changes are detected in the source code.

It is used during development to make backend development faster.

---

## Project Structure

The BulldogEx Shop project uses a separated frontend and backend structure.

```text
banzuela-webprog-longexam/
│
├── banzuela-client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   │
│   │   ├── assets/
│   │   │   └── ProductImages.js
│   │   │
│   │   ├── components/
│   │   │   ├── Button.jsx
│   │   │   ├── NavBar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── other reusable components
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   │
│   │   ├── layouts/
│   │   │   ├── AuthLayout.jsx
│   │   │   └── DashLayout.jsx
│   │   │
│   │   ├── pages/
│   │   │   │
│   │   │   ├── AuthPages/
│   │   │   │   ├── SignInPage.jsx
│   │   │   │   └── SignUpPage.jsx
│   │   │   │
│   │   │   ├── DashboardPages/
│   │   │   │   └── DashboardPage.jsx
│   │   │   │
│   │   │   └── LandingPages/
│   │   │       ├── HomePage.jsx
│   │   │       ├── ProductListPage.jsx
│   │   │       ├── ProductPage.jsx
│   │   │       ├── CartPage.jsx
│   │   │       ├── OrdersPage.jsx
│   │   │       ├── ReviewPage.jsx
│   │   │       └── AccountPage.jsx
│   │   │
│   │   ├── services/
│   │   │   ├── CartService.js
│   │   │   ├── CategoryService.js
│   │   │   ├── OrderService.js
│   │   │   ├── ProductService.js
│   │   │   ├── ReviewService.js
│   │   │   └── UserService.js
│   │   │
│   │   ├── App.jsx
│   │   ├── constants.js
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── banzuela-server/
│   │
│   ├── config/
│   │   ├── constants.js
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── cartController.js
│   │   ├── categoryController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   ├── reviewController.js
│   │   └── userController.js
│   │
│   ├── middleware/
│   │   ├── authentication.js
│   │   └── authorization.js
│   │
│   ├── models/
│   │   ├── cartModel.js
│   │   ├── categoryModel.js
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   ├── reviewModel.js
│   │   └── userModel.js
│   │
│   ├── routes/
│   │   ├── cartRoutes.js
│   │   ├── categoryRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   ├── reviewRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── index.js
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

The `.env` file is included in the structure only to show where it is located. It must be excluded from GitHub.

---

## Client-Side Design Pattern

The frontend follows a **component-based architecture** with a **service layer**.

The purpose of this structure is to separate the user interface, application state, and API communication.

The general frontend flow is:

```text
React Pages
     │
     ▼
Reusable Components
     │
     ▼
Service Layer
     │
     ▼
Axios
     │
     ▼
Express REST API
```

### Components

Reusable interface elements are stored inside:

```text
src/components/
```

Components are designed to be reused by multiple pages.

For example:

```text
Button.jsx
ProductCard.jsx
NavBar.jsx
```

Instead of creating the same button or product card repeatedly, the application uses reusable React components.

### Pages

Pages represent the main screens of the application.

Examples include:

```text
ProductListPage.jsx
ProductPage.jsx
CartPage.jsx
OrdersPage.jsx
ReviewPage.jsx
AccountPage.jsx
```

Pages combine components and services to provide complete application functionality.

### Context

The application uses React Context for authentication-related information.

The authentication context manages information such as:

```text
Current user
Authentication state
Login
Logout
```

The `AuthContext.jsx` file allows different components and pages to access the authenticated user without passing the user information manually through every component.

### Services

The service layer contains API communication functions.

For example:

```text
ProductService.js
CartService.js
OrderService.js
ReviewService.js
UserService.js
```

The pages call these service functions instead of directly writing Axios requests throughout the interface.

This provides a separation between:

```text
User Interface
      │
      ▼
Service Layer
      │
      ▼
API
```

This makes the frontend easier to maintain.

---

## Server-Side Design Pattern

The backend follows an **MVC-inspired architecture** with a separate middleware layer.

The backend separates responsibilities into:

```text
Routes
Middleware
Controllers
Models
Database
```

The general server architecture is:

```text
Client Request
      │
      ▼
    Routes
      │
      ▼
 Authentication
      │
      ▼
 Authorization
      │
      ▼
  Controller
      │
      ▼
    Model
      │
      ▼
 MongoDB Atlas
      │
      ▼
  Controller
      │
      ▼
 JSON Response
```

### Routes

Routes define the available API endpoints.

The route files are stored in:

```text
banzuela-server/routes/
```

Examples include:

```text
userRoutes.js
productRoutes.js
categoryRoutes.js
cartRoutes.js
orderRoutes.js
reviewRoutes.js
```

Routes determine which controller function should process an incoming request.

### Middleware

The project uses two major middleware modules:

```text
authentication.js
authorization.js
```

Authentication verifies whether the request contains a valid JWT.

Authorization checks whether the authenticated user has the required role.

For example:

```javascript
authentication
authorize("admin")
```

means that the user must be authenticated and must have the `admin` role before the controller is executed.

### Controllers

Controllers contain the main application logic.

The controller files are stored in:

```text
banzuela-server/controllers/
```

Examples include:

```text
userController.js
productController.js
categoryController.js
cartController.js
orderController.js
reviewController.js
```

Controllers process requests, validate information, interact with models, and return responses.

### Models

Models define the structure of MongoDB documents using Mongoose.

The models are stored in:

```text
banzuela-server/models/
```

The main models are:

```text
User
Product
Category
Cart
Order
Review
```

---

## Client-Server Integration

The React frontend and Express backend are separate applications.

The frontend is responsible for the user interface and user interaction, while the backend is responsible for API processing, authentication, authorization, business logic, and database operations.

The two applications communicate through REST API requests.

The integration works as follows:

```text
+----------------------------+
|       React Frontend       |
|      banzuela-client       |
+-------------+--------------+
              |
              | Axios
              | HTTP Request
              ▼
+----------------------------+
|      Express Backend       |
|      banzuela-server       |
+-------------+--------------+
              |
              ▼
+----------------------------+
|          Routes            |
+-------------+--------------+
              |
              ▼
+----------------------------+
| Authentication /           |
| Authorization Middleware   |
+-------------+--------------+
              |
              ▼
+----------------------------+
|        Controllers         |
+-------------+--------------+
              |
              ▼
+----------------------------+
|     Mongoose Models        |
+-------------+--------------+
              |
              ▼
+----------------------------+
|       MongoDB Atlas        |
+----------------------------+
```

### Frontend Request

When a user performs an action, the React page calls an appropriate service.

For example, when viewing a product:

```text
ProductPage.jsx
      │
      ▼
ProductService.js
      │
      ▼
Axios GET Request
      │
      ▼
GET /api/v1/product/:id
```

### Backend Processing

The Express server receives the request and sends it to the appropriate route.

```text
productRoutes.js
      │
      ▼
productController.js
      │
      ▼
productModel.js
      │
      ▼
MongoDB Atlas
```

### Backend Response

The database returns the requested information.

The information then travels back through the controller and Express API.

```text
MongoDB Atlas
      │
      ▼
Controller
      │
      ▼
Express Response
      │
      ▼
Axios
      │
      ▼
React Page
```

The React page then updates the user interface using the returned data.

---

## Authentication and Client-Server Integration

Authentication is integrated between the frontend and backend using JSON Web Tokens.

The login process is:

```text
User
 │
 ▼
SignInPage.jsx
 │
 ▼
UserService.js
 │
 ▼
POST /api/v1/user/login
 │
 ▼
userController.js
 │
 ▼
Validate User Credentials
 │
 ▼
Generate JWT
 │
 ▼
React Frontend
 │
 ▼
localStorage
```

After login, the frontend stores the authentication information.

Protected requests include the JWT:

```http
Authorization: Bearer <token>
```

The backend authentication middleware verifies the token.

If the token is valid:

```text
request.user
```

contains the decoded user information.

The authorization middleware then checks the user's role.

---

## Role-Based Access Control

BulldogEx Shop uses role-based access control with the following roles:

```text
customer
seller
admin
```

### Customer

Customers are allowed to perform shopping-related operations.

```text
Products
Cart
Orders
Reviews
Profile
```

### Seller

Sellers are allowed to manage products and access seller-related order functions.

```text
Products
Orders
Reviews
Dashboard
```

### Admin

Administrators have the highest level of access.

```text
Users
Products
Categories
Orders
Reviews
Dashboard
```

The authorization middleware is used to restrict protected routes.

Example:

```javascript
authorize("admin")
```

allows only administrators.

Example:

```javascript
authorize("admin", "seller")
```

allows both administrators and sellers.

Example:

```javascript
authorize("customer")
```

allows only customers.

---

## User Ownership Validation

In addition to checking user roles, the backend also verifies ownership for resources that belong to individual users.

For example, a customer should only be able to access their own orders or cart.

The backend compares the authenticated user's ID with the requested user's ID.

The general process is:

```text
Authenticated User ID
        │
        ▼
Compare with Resource Owner ID
        │
        ├── Same User
        │      │
        │      ▼
        │   Allow Request
        │
        └── Different User
               │
               ▼
          403 Forbidden
```

This provides an additional layer of protection beyond role-based access control.

---

## Main API Routes

The backend exposes the following main API route groups:

```text
/api/v1/user
/api/v1/product
/api/v1/category
/api/cart
/api/order
/api/review
```

### User API

Base route:

```text
/api/v1/user
```

Main functions include:

```text
POST   /register
POST   /login
GET    /
GET    /:id
PUT    /:id
PUT    /:id/change-password
DELETE /:id
```

Registration and login are public.

User management routes are protected using authentication and authorization middleware.

### Product API

Base route:

```text
/api/v1/product
```

Main functions include:

```text
GET    /
GET    /:id
POST   /
PUT    /:id
DELETE /:id
```

Viewing products is publicly available.

Creating, updating, and deleting products are restricted to authorized administrative or seller accounts.

### Category API

Base route:

```text
/api/v1/category
```

Categories can be viewed publicly, while category management is restricted to administrators.

### Cart API

Base route:

```text
/api/cart
```

Main operations include:

```text
GET    /user/:userId
POST   /
PUT    /:id
PATCH  /user/:userId/item/:productId
DELETE /user/:userId/item/:productId
DELETE /user/:userId
DELETE /:id
```

Cart operations are restricted to customers.

### Order API

Base route:

```text
/api/order
```

Main operations include:

```text
GET    /
GET    /dashboard
GET    /user/:userId
GET    /:id
POST   /
PUT    /:id
DELETE /:id/cancel
DELETE /admin/:id
```

Customers can create and view their own orders and cancel pending orders.

Administrators can view and manage orders.

Sellers can access seller-related order management functions.

### Review API

Base route:

```text
/api/review
```

The review API handles:

* Product reviews
* Creating reviews
* Updating reviews
* Deleting reviews
* Retrieving reviews

Review operations are protected according to the user's authentication, role, and ownership.

---

## Database Structure

BulldogEx Shop uses MongoDB Atlas with Mongoose.

The main collections are:

```text
Users
Products
Categories
Carts
Orders
Reviews
```

### User

Stores account information.

Main information includes:

```text
firstName
lastName
email
password
contactNumber
address
role
isActive
createdAt
updatedAt
```

The supported roles are:

```text
admin
seller
customer
```

### Product

Stores product information including:

```text
productName
description
price
stock
category
image
```

### Category

Stores product category information.

Products reference categories using MongoDB ObjectIds.

### Cart

Stores customer shopping cart information.

The cart is associated with a user and contains product items and quantities.

### Order

Stores customer order information including:

```text
user
items
totalAmount
shippingAddress
paymentMethod
status
```

### Review

Stores customer product reviews and ratings.

Reviews are associated with products and users.

---

## Data Relationships

The main database relationships are:

```text
User
 │
 ├──────────────► Cart
 │
 ├──────────────► Order
 │
 └──────────────► Review

Product
 │
 ├──────────────► Category
 │
 ├──────────────► Cart Item
 │
 ├──────────────► Order Item
 │
 └──────────────► Review
```

These relationships are implemented using MongoDB ObjectIds and Mongoose references.

---

## Order Process

The customer order process is:

```text
Customer
    │
    ▼
Browse Products
    │
    ▼
View Product
    │
    ▼
Add to Cart
    │
    ▼
Review Cart
    │
    ▼
Enter Shipping Address
    │
    ▼
Select Payment Method
    │
    ▼
Checkout
    │
    ▼
Create Order
    │
    ▼
View Orders
```

The backend creates the order after receiving the checkout request.

The newly created order starts with the configured pending/ongoing status used by the application.

Administrators and authorized sellers can then manage the order status.

---

## HTTP Status Codes

The backend uses standard HTTP status codes.

```text
200 OK
201 Created
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
500 Internal Server Error
```

### 200 OK

The request was successfully completed.

### 201 Created

A new resource was successfully created.

### 400 Bad Request

The request contains invalid or incomplete information.

### 401 Unauthorized

The user has not provided a valid authentication token.

### 403 Forbidden

The user is authenticated but does not have permission to access the requested resource.

### 404 Not Found

The requested resource does not exist.

### 500 Internal Server Error

An unexpected error occurred on the backend.

---

## Setup Instructions

Follow the steps below to run BulldogEx Shop locally.

### Requirements

Install the following before running the project:

* Node.js
* npm
* Git
* Visual Studio Code
* MongoDB Atlas account

Check Node.js:

```bash
node --version
```

Check npm:

```bash
npm --version
```

Check Git:

```bash
git --version
```

---

## 1. Clone the Repository

Clone the GitHub repository:

```bash
git clone <repository-url>
```

Go into the project:

```bash
cd banzuela-webprog-longexam
```

---

## 2. Install Backend Dependencies

Go to the backend:

```bash
cd banzuela-server
```

Install the dependencies:

```bash
npm install
```

---

## 3. Configure Environment Variables

Create the following file:

```text
banzuela-server/.env
```

Add the required environment variables.

Example:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
SALT=10
PORT=8000
```

Use the exact variable names required by the backend configuration.

Do not upload the actual `.env` file to GitHub.

---

## 4. Configure MongoDB Atlas

To configure MongoDB Atlas:

1. Sign in to MongoDB Atlas.
2. Create or select a project.
3. Create a database cluster.
4. Open **Database Access**.
5. Create a database user.
6. Open **Network Access**.
7. Add your IP address.
8. Select **Connect**.
9. Copy the MongoDB connection string.
10. Place the connection string inside `MONGO_URI`.

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/BullEx
```

---

## 5. Start the Backend

Inside the backend folder:

```bash
cd banzuela-server
npm run dev
```

The backend runs on:

```text
http://localhost:8000
```

The API is available under:

```text
http://localhost:8000/api
```

---

## 6. Install Frontend Dependencies

Open another terminal.

Go to the frontend:

```bash
cd banzuela-client
```

Install the dependencies:

```bash
npm install
```

---

## 7. Configure Frontend API URL

The frontend uses the backend API URL through the project constants configuration.

During local development, the backend runs on:

```text
http://localhost:8000
```

The frontend service files use this base URL to communicate with the Express API.

---

## 8. Start the Frontend

Inside the frontend folder:

```bash
npm run dev
```

Vite will provide a local address similar to:

```text
http://localhost:5173
```

Open the address in a browser.

---

## 9. Run the Full Application

Both applications must be running.

### Backend

```bash
cd banzuela-server
npm run dev
```

### Frontend

```bash
cd banzuela-client
npm run dev
```

Then open:

```text
http://localhost:5173
```

---

## Testing with Postman

Postman is used to test the backend REST API.

### Public Request

For example:

```http
GET http://localhost:8000/api/v1/product
```

Public routes can be tested without an authentication token.

### Login

To test authentication:

```http
POST http://localhost:8000/api/v1/user/login
```

Provide the required login credentials in the request body.

After a successful login, the backend returns a JWT token.

Copy the token.

### Testing Protected Routes

For protected requests:

1. Open the request in Postman.
2. Select **Authorization**.
3. Select **Bearer Token**.
4. Paste the JWT token.
5. Send the request.

The request will contain:

```http
Authorization: Bearer <token>
```

### Testing Role-Based Access

Different accounts can be used to verify authorization.

For example:

```text
Admin Account
Customer Account
Seller Account
```

An administrator-only route should allow an admin account.

A customer attempting to access an administrator-only route should receive:

```text
403 Forbidden
```

A request without authentication should receive:

```text
401 Unauthorized
```

---

## Authentication Testing

Authentication can be tested using the following process:

```text
1. Register User
       ↓
2. Login User
       ↓
3. Receive JWT
       ↓
4. Copy JWT
       ↓
5. Send JWT in Authorization Header
       ↓
6. Access Protected Route
```

This confirms that the authentication middleware is properly protecting restricted resources.

---

## Authorization Testing

Authorization can be tested by logging in using accounts with different roles.

Example:

```text
Admin
Customer
Seller
```

The same protected endpoint can then be tested using different JWT tokens.

Expected behavior:

```text
Correct Role
     ↓
Access Granted

Incorrect Role
     ↓
403 Forbidden
```

For example, an admin-only endpoint such as:

```text
GET /api/v1/user/:id
```

should reject a customer token with:

```text
403 Forbidden
```

This confirms that role-based access control is functioning correctly.

---

## Common Setup Problems

### MongoDB Authentication Failed

If the backend displays an authentication error, check:

* MongoDB username
* MongoDB password
* MongoDB connection string
* Database Access
* Network Access
* `.env` configuration

Restart the backend after changing environment variables.

### MONGO_URI is Undefined

If the server reports that the MongoDB URI is undefined, check:

```text
banzuela-server/.env
```

and make sure the required MongoDB environment variable exists.

Restart the backend afterward.

### Frontend Cannot Connect to Backend

Make sure the backend is running:

```text
http://localhost:8000
```

Also verify that the frontend service files are using the correct API base URL.

### 401 Unauthorized

A `401 Unauthorized` response usually means that:

* No token was provided
* The token is expired
* The token is invalid
* The Authorization header is incorrect

Use:

```http
Authorization: Bearer <token>
```

### 403 Forbidden

A `403 Forbidden` response means that the user is authenticated but does not have permission to access the requested resource.

For example:

```text
Customer → Admin-only route
```

will result in:

```text
403 Forbidden
```

### Module Not Found

Run:

```bash
npm install
```

inside the folder where the error occurs.

Frontend:

```bash
cd banzuela-client
npm install
```

Backend:

```bash
cd banzuela-server
npm install
```

### Port Already in Use

Stop the running server:

```text
Ctrl + C
```

Then start it again.

---

## Security Notes

The following information must never be uploaded to GitHub:

```text
.env
MongoDB username
MongoDB password
MongoDB connection string
JWT secret
Private API keys
```

Environment variables should be used for sensitive configuration.

The application also implements:

* JWT authentication
* Password hashing with bcryptjs
* Role-based authorization
* Protected API routes
* User ownership validation
* CORS configuration
* Input validation

---

## Architecture Summary

BulldogEx Shop uses a full-stack client-server architecture.

The frontend and backend are separated into two applications.

```text
                    BulldogEx Shop
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
      React Frontend            Express Backend
     banzuela-client            banzuela-server
             │                         │
             ▼                         ▼
       React Pages                 Routes
             │                         │
             ▼                    Middleware
       Components                     │
             │                 ┌───────┴───────┐
             ▼                 ▼               ▼
       Service Layer      Authentication  Authorization
             │                 │               │
             ▼                 └───────┬───────┘
           Axios                       │
             │                         ▼
             └──────────────────► Controllers
                                       │
                                       ▼
                                     Models
                                       │
                                       ▼
                                 MongoDB Atlas
```

---

## Design Pattern Summary

| Application Area           | Design Pattern / Architecture | Purpose                                                              |
| -------------------------- | ----------------------------- | -------------------------------------------------------------------- |
| React Frontend             | Component-Based Architecture  | Divides the UI into reusable React components                        |
| Frontend API Communication | Service Layer Pattern         | Separates API requests from page components                          |
| Authentication State       | Context Pattern               | Provides authentication information throughout the React application |
| Express Backend            | MVC-Inspired Architecture     | Separates routes, controllers, and database models                   |
| Middleware                 | Middleware Pattern            | Handles authentication and authorization before controllers          |
| Database                   | Mongoose Model Layer          | Defines schemas and handles MongoDB operations                       |

---

## Why This Architecture Is Used

The architecture was selected to keep the project organized and maintainable.

The frontend does not directly communicate with MongoDB. Instead, it communicates with the backend API.

The backend controls access to the database and handles authentication, authorization, and business logic.

This separation provides the following benefits:

* Easier maintenance
* Reusable frontend components
* Separation of concerns
* Centralized API communication
* Protected backend resources
* Better organization of database operations
* Easier testing using Postman
* Easier future development

The overall responsibility is divided as follows:

```text
Frontend
→ User Interface and Interaction

Services
→ API Communication

Routes
→ API Endpoint Definition

Middleware
→ Authentication and Authorization

Controllers
→ Application Logic

Models
→ Database Structure and Operations

MongoDB Atlas
→ Data Storage
```

---

## Quick Start

After the project has been configured:

### Terminal 1 - Backend

```bash
cd banzuela-server
npm install
npm run dev
```

### Terminal 2 - Frontend

```bash
cd banzuela-client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

---

## Author

Developed as a full-stack Web Programming project using React, Node.js, Express.js, MongoDB, JWT authentication, and role-based access control.
