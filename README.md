# Foodeli - MERN Stack Food Delivery Application

A full-stack food delivery application built with the MERN (MongoDB, Express.js, React.js, Node.js) stack.

## Features

- User authentication and authorization using JWT
- Restaurant listing and menu management
- Food item browsing and searching
- Shopping cart functionality
- Order placement and tracking
- Favorites management
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- CORS for cross-origin resource sharing

### Frontend
- React.js
- Redux for state management
- Axios for API calls
- Material-UI components
- React Router for navigation

## Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/              # Source files
│   │   ├── api/          # API integration
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── redux/        # Redux store and slices
│   │   └── utils/        # Utility functions
│   └── package.json      # Frontend dependencies
│
├── server/                # Node.js backend
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── index.js         # Server entry point
│   └── package.json     # Backend dependencies
│
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/foodeli.git
cd foodeli
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd server
npm install
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd ../client
npm install
\`\`\`

4. Create environment variables:
   - Copy .env.template to .env in the server directory
   - Fill in your MongoDB connection string and JWT secret

### Running the Application

1. Start the backend server:
\`\`\`bash
cd server
npm start
\`\`\`

2. Start the frontend development server:
\`\`\`bash
cd client
npm start
\`\`\`

The application will be available at http://localhost:3000

## API Documentation

### Authentication Endpoints

- POST /api/user/signup - Register new user
- POST /api/user/signin - User login

### Restaurant Endpoints

- GET /api/restaurant - Get all restaurants
- GET /api/restaurant/:id - Get restaurant details
- POST /api/restaurant - Create new restaurant (protected)
- PUT /api/restaurant/:id - Update restaurant (protected)
- DELETE /api/restaurant/:id - Delete restaurant (protected)
- POST /api/restaurant/:id/menu - Add food item to menu (protected)
- DELETE /api/restaurant/:id/menu - Remove food item from menu (protected)

### Food Endpoints

- GET /api/food - Get all food items
- GET /api/food/:id - Get food item details
- POST /api/food - Create new food item (protected)
- PUT /api/food/:id - Update food item (protected)
- DELETE /api/food/:id - Delete food item (protected)

### Order Endpoints

- GET /api/user/order - Get user orders (protected)
- POST /api/user/order - Place new order (protected)

## Database Schema

### User Model
- name: String (required)
- email: String (required, unique)
- password: String (required)
- address: String
- favorites: [FoodId]
- orders: [OrderId]
- cart: [{product: FoodId, quantity: Number}]

### Restaurant Model
- name: String (required)
- cuisine: [String] (required)
- address: String (required)
- rating: Number
- menu: [FoodId]
- openingHours: String (required)
- contactNumber: String (required)
- image: String

### Food Model
- restaurant: RestaurantId (required)
- name: String (required)
- desc: String (required)
- price: {org: Number, mrp: Number, off: Number}
- category: [String]
- ingredients: [String] (required)
- image: String

### Order Model
- total_amount: Number (required)
- address: String (required)
- status: String
- user: UserId (required)
- products: [{product: FoodId, quantity: Number}] (required)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
