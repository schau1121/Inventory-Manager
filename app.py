from flask import Flask
from flask_restful import Api
from db import db

from resources.warehouse import Warehouse, WarehouseList
from resources.item import Item

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///data.db'

api = Api(app)

@app.before_first_request
def create_tables():
    db.create_all()

api.add_resource(Warehouse, "/api/warehouse/<string:name>")
api.add_resource(WarehouseList, "/api/warehouses")
api.add_resource(Item, "/api/item/<string:name>&<int:warehouse_id>")

if __name__ == "__main__":
    db.init_app(app)
    app.run(port=5000, debug=True)