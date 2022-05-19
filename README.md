# Inventory-Manager

This is an inventory management web application built with Flask, Flask-RESTful, SQLAlchemy, HTML, CSS, and Vanilla JS.

Check it out @ https://inventory-manager.schau1121.repl.co/

## Instructions For Running on Replit.com

Currently the repl has some issues with the "Run" button and installing packages.

To run this application enter the following in the console

> pip install -r requirements.txt  
> python app.py

## Requirements

- Python 3.8 or greater
- pip

To ensure all dependencies are installed, run

> pip install -r requirements.txt

in your terminal.

## Usage

You can check out this project in the link above, otherwise:

To run this web application locally, remove 'host="0.0.0.0"' in app.py line 42  
and run the following in your terminal.

> python app.py

Then navigate to localhost:5000 in your browser.

## How It Works

The backend is build off Flask, a lightweight python framework designed for the web. Basically, I implemented an internal API using Flask-RESTful so that the frontend can access data for items and warehouses. Furthermore, this API utilizes SQLAlchemy as the ORM so that if necessary, I can configure the app to work with a new database.
The frontend is built with HTML, CSS, Vanilla JS, with Jinja2 tying it all together. Jinja2 is a web template engine which was ridiculously underutilized in this project, as I ultimately wrote individual HTML pages rather than working with templates.

## Internal API Endpoints

### Items

POST /api/item/<uuid>  
  This takes in a body with a name, model number, inventory, and warehouse_id and creates a new item in the database.
  
GET /api/item/<uuid>  
  This returns an item object, specified by the uuid in the URL.
  
PUT /api/item/<uuid>  
  This takes in a body with a name, model number, inventory, and warehouse_id and updates an existing item if found, otherwise, it creates a new item in the database.

DELETE /api/item/<uuid>  
  This deletes an item from the database, specified by the uuid in the URL.

GET /api/items  
  This returns a list of all items in the database.

GET /api/item/<name>
  This returns a list of all items which in the database which match the name specified in the URL.
  This endpoint has not been utilized yet in the app, but I fully intend on adding search functionality so that users can query items by name.

### Warehouses 

POST /api/warehouse/<name>  
  This takes in a body with a location and creates a warehouse in the database.

GET /api/warehouse/<name>  
  This returns a warehouse and its items, specified by the name in the URL.

DEL /api/warehouse/<name>  
  This deletes a warehouse from the database, specified by the name in the URL.
  
GET /api/warehouses  
  This returns a list of all warehouses in the database.  

## Things I Learned

- Using fetch in JavaScript to interact with REST APIs
- Backpopulating a form with values when editing an object
- Working with Promises in JavaScript
- Building a fullstack web application!!! (I'm really proud of myself haha)

## Things I Could've Improved

- This was my first time building a frontend, so my JS really needs some work
- Spending more time in the design phase since I needed to refactor a good chunck of my code midway through development due to poorly designed API endpoints
- Documenting and commenting more while coding, rather than going back and adding in comments later
- Spending less time on design when building an mvp is the priority
- Utilizing Jinja2 more effectively rather than writing entire HTML pages
