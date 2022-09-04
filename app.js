const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const userRoutes = require('./routes/user');
const adminRoutes = require("./routes/admin");


mongoose.connect('mongodb+srv://admin:admin@cluster0.h1ui5kv.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to database at port 3000');
  }).catch(() => {
    console.log('Error connecting to database!');
  }
);

mongoose.Promise = global.Promise;

app.use(morgan("dev"));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

const options = {
   definition : {
       openapi : "3.0.0",
       info : {
           title : "Backend ecommerce Node JS API Project", 
           version : "1.0.0"
       },
       servers : [
          {
            url : "http://localhost:3000"
          }
        ]
   }, 
   apis : ['./app.js' ]
}

const swaggerSpec =  swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /products/:
 *   get: 
 *       summary : Get all products
 *       description : This api is used to get all products in our ecommerce project
 *       responses : 
 *            200: 
 *               description : testing Get all products method
 */

// Routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
