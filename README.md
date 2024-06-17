# Xeno Backend

Welcome to the Xeno Backend repository! This application uses Express for handling API requests, RabbitMQ for asynchronous messaging, and MySQL for database storage.

## Directory Structure

- **src**: Source code of the application.
  - **api**: Contains the controllers, middlewares, and routes.
    - **controllers**: Business logic of the application.
    - **middlewares**: Express middlewares for handling authentication, logging, etc.
    - **routes**: API routes definitions.
  - **consumer**: Contains RabbitMQ consumer scripts.
    - **core**: Core business logic and functionality.
    - **db**: Database configurations and scripts.
    - **dal**: Data Access Layer, interfacing with the database.
    - **models**: Sequelize models defining the schema for MySQL.
      - **Audience.ts**: Model for the audience data.
      - **CommunicationLog.ts**: Model for logging communication.
      - **Customer.ts**: Model for customer information.
      - **Order.ts**: Model for order processing.
      - **User.ts**: User model for authentication.
      - **Visit.ts**: Model for tracking visits.
    - **services**: Service layer for handling business logic.
    - **utils**: Utility functions and helpers.

## Setup and Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
3. Set up the MySQL database.
4. Configure the .env file with your database credentials and RabbitMQ settings.
5. Run the server:
   ```bash
   npm start

## API Endpoints
### Audience
- GET /audiences: Retrieve all audiences.
- POST /audiences: Create a new audience.
- GET /audiences/:id: Get a specific audience by ID.
- POST /audiences/:id/startCampaign: Start a campaign for a specific audience.
- GET /audiences/:id/campaignLog: Retrieve the campaign log for a specific audience.
### Customers
- GET /customers: Retrieve all customers.
- POST /customers: Create a new customer.
- GET /customers/:id: Get a specific customer by ID.
### Orders
- GET /orders: Retrieve all orders.
- POST /orders: Create a new order.
- GET /orders/:id: Get a specific order by ID.
### Visits
- POST /visits: Record a new visit.

## Contributing
Feel free to fork this repository and submit pull requests. You can also send us an email with any suggestions.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
