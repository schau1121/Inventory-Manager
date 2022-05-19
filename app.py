from flask import Flask, render_template
from flask_restful import Api
from db import db

from resources.warehouse import Warehouse, WarehouseList
from resources.item import AllItemsList, Item, ItemList

app = Flask(__name__)
# this setting allows us to change the database, for example, if we choose to deploy using heroku
# we can set up this app/api to work with a postgresql db or even mongodb
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///data.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
api = Api(app)

# initializes the sqlite database if it doesn't already exist
@app.before_first_request
def create_tables():
    db.create_all()

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/items")
def items():
    return render_template("items.html")

@app.route("/warehouses")
def warehouses():
    return render_template("warehouses.html")

# API endpoints
api.add_resource(Warehouse, "/api/warehouse/<string:name>")
api.add_resource(WarehouseList, "/api/warehouses")
api.add_resource(Item, "/api/item/<string:uuid>")
api.add_resource(ItemList, "/api/item/<string:name>")
api.add_resource(AllItemsList, "/api/items")

if __name__ == "__main__":
    db.init_app(app)
    # remove host="0.0.0.0" if you would like to run this app locally
    app.run(host="0.0.0.0", port=5000, debug=True)