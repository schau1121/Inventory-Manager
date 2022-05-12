from flask_restful import Resource
from models.item import ItemModel

class Item(Resource):
    def get(self, name, warehouse_id):
        item = ItemModel.find_by_name_warehouse(name, warehouse_id)
        if item:
            return item.json()
        return {"message": "Item not found"}, 404
    
    def post(self, name, model_num, inventory, warehouse_id):
        if ItemModel.find_by_name_warehouse(name, warehouse_id):
            #increment inventory
            return
    
        item = ItemModel(name, model_num, inventory, warehouse_id)
        try:
            item.save_to_db()
        except:
            return {"message": "An error occurred creating the item."}, 500
    
        return item.json(), 201
    
    #delete method
    #put method
    
#item list resource