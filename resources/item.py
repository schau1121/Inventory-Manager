from flask_restful import Resource, reqparse
from pkg_resources import require
from models.item import ItemModel

class Item(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("model_num",
                        type=str,
                        required=False
                        )
    parser.add_argument("inventory",
                        type=int,
                        required=True,
                        help="An item must have an inventory amount."
                        )
    
    def get(self, name, warehouse_id):
        item = ItemModel.find_by_name_warehouse(name, warehouse_id)
        if item:
            return item.json()
        return {"message": "Item not found"}, 404
    
    def post(self, name, warehouse_id):
        if ItemModel.find_by_name_warehouse(name, warehouse_id):
            return {
                "message": f"An item with this name already exists at warehouse {warehouse_id}"
            }, 400

        data = Item.parser.parse_args()
        item = ItemModel(name, data['model_num'], data['inventory'], warehouse_id)
        try:
            item.save_to_db()
        except:
            return {"message": "An error occurred creating the item."}, 500
    
        return item.json(), 201
    
    def delete(self, name, warehouse_id):
        item = ItemModel.find_by_name_warehouse(name, warehouse_id)
        if(item):
            item.delete_from_db()
            return {"message": "Item deleted."}
        return {"message": "Item not found."}, 404
    
    def put(self, name, warehouse_id):
        data = Item.parser.parse_args()
        inventory = data["inventory"]
        model_num = data["model_num"]
        
        item = ItemModel.find_by_name_warehouse(name, warehouse_id)
        
        if item:
            item.inventory = inventory
            item.model_num = model_num
        else:
            item = ItemModel(name, model_num, inventory, warehouse_id)
        
        item.save_to_db()
        
        return item.json()
    
class ItemList(Resource):
    def get(self, name):
        return {
            f"{name}s": list(map(lambda x: x.json(), ItemModel.find_all_by_name(name)))
        }

class AllItemsList(Resource):
    def get(self):
        return {
            'items': list(map(lambda x: x.json(), ItemModel.query.all()))
        }