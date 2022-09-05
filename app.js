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

//  Swagger Schema :

/**
 * @swagger 
 *   components:
 *      schemas:
 *         orderSchema:
 *             type: object
 *             properties:
 *                 _id:
 *                    type: string
 *                 name:
 *                    type: string
 *                 quantity:
 *                    type: integer
 */

/**
 * @swagger 
 *   components:
 *      schemas:
 *         productSchema:
 *             type: object
 *             properties:
 *                 _id:
 *                    type: string
 *                 name:
 *                    type: string
 *                 price: 
 *                    type: integer
 *                 category:
 *                    type: string
 */

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

 /**
 * @swagger
 * /products/{productId}:
 *   get: 
 *       summary : Get specific products
 *       description : This api is used to get specific products in our ecommerce project
 *       parameters : 
 *        - in : path
 *          name : productId
 *          required : true
 *          decription : alphanumeric number
 *       responses : 
 *            200: 
 *               description : testing get specific products method
 *               contenst: 
 *                   application/json:
 *                       schema:
 *                          type: array
 *                          item:
 *                             $ref:'#components/schemas/productSchema'
 */

/**
 * @swagger
 * /products/search/{productId}:
 *   get: 
 *       summary : Get specific products by search
 *       description : This api is used to get specific products by search in our ecommerce project
 *       parameters : 
 *        - in : path
 *          name : productId
 *          required : true
 *          decription : alphanumeric number
 *       responses : 
 *            200: 
 *               description : testing get specific products by search method
 *               contenst: 
 *                   application/json:
 *                       schema:
 *                          type: array
 *                          item:
 *                             $ref:'#components/schemas/productSchema'
 */


/**
 * @swagger
 * /orders/:
 *   get: 
 *       summary : Get all orders
 *       description : This api is used to get all orders in our ecommerce project
 *       responses : 
 *            200: 
 *               description : testing Get all order method
 */


/**
 * @swagger
 * /orders/{orderId}:
 *   get: 
 *       summary : Get specific order
 *       description : This api is used to get specific order in our ecommerce project
 *       parameters : 
 *        - in : path
 *          name : orderId
 *          required : true
 *          decription : alphanumeric number
 *       responses : 
 *            200: 
 *               description : testing get specific order method
 *               contenst: 
 *                   application/json:
 *                       schema:
 *                          type: array
 *                          item:
 *                             $ref:'#components/schemas/orderSchema'
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
