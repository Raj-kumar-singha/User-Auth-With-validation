const express = require("express");
const app = express();
const mongoose = require("mongoose");
const allApis = require('./router/index')


// MongoDB connection string
const connectionString = 'mongodb://localhost:27017/testing';
mongoose.connect(connectionString)
.then(() => {
  console.log('Connected to MongoDB successfully');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to ' + connectionString);
});
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});


process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

app.use(express.json());
app.use("/api", allApis);

//! Print Bad Request
app.use((req, res, next) => {
  res.status(404).send({
    error: "Bad Request",
  });
});

app.use((err, req, res, next) => {
  res.status(500).send("Something broke!");
});

app.listen(4040, () => {
  console.log("server is running on post no 4040");
});