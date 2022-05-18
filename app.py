from flask import Flask, render_template
from flask_restful import Api
from db import db

from resources.warehouse import Warehouse, WarehouseList
from resources.item import AllItemsList, Item, ItemList

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///data.db'
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
api = Api(app)

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

api.add_resource(Warehouse, "/api/warehouse/<string:name>")
api.add_resource(WarehouseList, "/api/warehouses")
api.add_resource(Item, "/api/item/<string:uuid>")
api.add_resource(ItemList, "/api/item/<string:name>")
api.add_resource(AllItemsList, "/api/items")

if __name__ == "__main__":
    db.init_app(app)
    app.run(port=5000, debug=True)