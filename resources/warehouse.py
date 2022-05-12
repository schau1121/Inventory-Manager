from flask_restful import Resource
from models.warehouse import WarehouseModel

class Warehouse(Resource):
    def get(self, name):
        warehouse = WarehouseModel.find_by_name(name)
        if warehouse:
            return warehouse.json()
        return {"message": "Store not found"}, 404
    
    def post(self, name, location):
        if WarehouseModel.find_by_name(name):
            return {"message": "A warehouse with name '{}' already exists."
                    .format(name)}, 400
        
        if WarehouseModel.find_by_location(location):
            return {"message": "A warehouse with location '{}' already exists."
                    .format(location)}, 400
        
        warehouse = WarehouseModel(name, location)
        try:
            warehouse.save_to_db()
        except:
            return {"message": "An error occurred creating the warehouse."}, 500
        
        return warehouse.json(), 201
    
    def delete(self, name):
        warehouse = WarehouseModel.find_by_name(name)
        if warehouse:
            warehouse.delete_from_db()
        
        return {"message": "Warehouse deleted"}

class WarehouseList(Resource):
    def get(self):
        return {"warehouses": list(map(lambda x: x.json(), WarehouseModel.query.all()))}