from flask_restful import Resource, reqparse
from models.warehouse import WarehouseModel

# This resource should contain a name and a location

class Warehouse(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument('location',
                        type=str,
                        required=True,
                        help="A warehouse needs a location!"
                        )
    
    def get(self, name):
        warehouse = WarehouseModel.find_by_name(name)
        if warehouse:
            return warehouse.json()
        return {"message": "Store not found"}, 404
    
    def post(self, name):
        if WarehouseModel.find_by_name(name):
            return {"message": "A warehouse with name '{}' already exists."
                    .format(name)}, 400
        
        data = Warehouse.parser.parse_args()
        location = data['location']
        
        # if we only want 1 warehouse per location, add code block below
        #if WarehouseModel.find_by_location(location):
        #    return {"message": "A warehouse with location '{}' already exists."
        #            .format(location)}, 400
        
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
        return {"message": "Warehouse not found."}, 404

# this resource represents a list of all warehouses
class WarehouseList(Resource):
    def get(self):
        return {"warehouses": list(map(lambda x: x.json(), WarehouseModel.query.all()))}