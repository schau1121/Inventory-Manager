from flask import Flask
from flask_restful import Api
from db import db

from resources.warehouse import Warehouse

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///data.db'

api = Api(app)

@app.before_first_request
def create_tables():
    db.create_all()

api.add_resource(Warehouse, "api/warehouse/<string:name>")

if __name__ == "__main__":
    db.init_app(app)
    app.run(port=5000, debug=True)