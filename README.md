<h1 align="center">ExpressJS - Simple E-Commerce Website using Express JS Framework</h1>



Blanja is simple e-commerce website focusing on back-end. Built with Node JS framework, Express JS. [Read more about Express JS](https://en.wikipedia.org/wiki/Express.js)

## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.17.x-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.18-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## End Point
**1. GET**

* `/items`(Get all list items)
* `/items/:id` (Get detail item by id)
* `/users` (Get all list users using auth)
* `/users/:id` (Get detail users by id using auth)

**2. POST**

* `/items` (Post or create new item into database using auth)
* `/users` (Post or register new user)

**3. PUT** 

* `/items/:id` (Update or change all data item by id on database using auth)
* `/users/:id` (Update detail users by id using auth)

**4. PATCH**

* `/items/:id` (Update or change some datas by id on database using auth)

**5. DELETE**

* `/items/:id` (Delete data item by id using auth)
* `/users/:id` (Delete data users by id using auth)
