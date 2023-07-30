const express = require('express');
const app = express();
const port = 3000;

// Import the customers array from customers.js
const customers = require('./customers');

// Middleware to parse incoming JSON data
app.use(express.json());

// Route: Welcome message when accessing the root endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Customer API!');
});

// Route: Get all customers
app.get('/api/customers', (req, res) => {
  res.json(customers);
});

// Route: Get a specific customer by ID
app.get('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  res.json(customer);
});

// Route: Add a new customer
app.post('/api/customers', (req, res) => {
  const { id, first_name, last_name, city, company } = req.body;

  if (!id || !first_name || !last_name || !city || !company) {
    return res.status(400).json({ error: 'Please provide all required customer data' });
  }

  // Check if the city and company already exist
  const existingCity = customers.some((customer) => customer.city === city);
  const existingCompany = customers.some((customer) => customer.company === company);

  if (!existingCity || !existingCompany) {
    return res.status(400).json({ error: 'City and company should already exist for an existing customer' });
  }

  const newCustomer = { id: parseInt(id), first_name, last_name, city, company };
  customers.push(newCustomer);

  res.status(201).json(newCustomer);
});

// Route: List API with search by first_name, last_name, and city with pagination
app.get('/api/customers/search', (req, res) => {
  const { first_name, last_name, city, page, limit } = req.query;
  const searchFirstName = first_name ? first_name.toLowerCase() : '';
  const searchLastName = last_name ? last_name.toLowerCase() : '';
  const searchCity = city ? city.toLowerCase() : '';

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.first_name.toLowerCase().includes(searchFirstName) &&
      customer.last_name.toLowerCase().includes(searchLastName) &&
      customer.city.toLowerCase().includes(searchCity)
  );

  const currentPage = parseInt(page) || 1;
  const itemsPerPage = parseInt(limit) || 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedCustomers = filteredCustomers.slice(startIndex, endIndex);

  res.json({
    total_results: filteredCustomers.length,
    total_pages: Math.ceil(filteredCustomers.length / itemsPerPage),
    current_page: currentPage,
    customers: paginatedCustomers,
  });
});

// Route: API to list all the unique cities with the number of customers from a particular city
app.get('/api/cities', (req, res) => {
  const cityCounts = {};
  customers.forEach((customer) => {
    const city = customer.city;
    if (cityCounts[city]) {
      cityCounts[city]++;
    } else {
      cityCounts[city] = 1;
    }
  });

  res.json(cityCounts);
});

// Route: Create an API to update customer resource's attributes such as first_name, last_name, etc.
app.put('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { first_name, last_name, city, company } = req.body;

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  // Update customer attributes if provided
  if (first_name) customer.first_name = first_name;
  if (last_name) customer.last_name = last_name;
  if (city) customer.city = city;
  if (company) customer.company = company;

  res.json(customer);
});

// Route: Create an API to delete a customer
app.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const customerIndex = customers.findIndex((c) => c.id === id);

  if (customerIndex === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }

  customers.splice(customerIndex, 1);

  res.json({ message: 'Customer deleted successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
