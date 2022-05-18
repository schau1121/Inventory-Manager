from flask_restful import Resource, reqparse
from pkg_resources import require
from models.item import ItemModel

class Item(Resource):
    parser = reqparse.RequestParser()
    parser.add_argument("name",
                        type=str,
                        required=True,
                        help="An item must have a name."
                        )
    parser.add_argument("model_num",
                        type=str,
                        required=False
                        )
    parser.add_argument("inventory",
                        type=int,
                        required=True,
                        help="An item must have an inventory amount."
                        )
    parser.add_argument("warehouse_id",
                        type=int,
                        required=False
                        )

    
    def get(self, uuid):
        item = ItemModel.find_by_uuid(uuid)
        if item:
            return item.json()
        return {"message": "Item not found"}, 404
    
    def post(self, uuid):
        if ItemModel.find_by_uuid(uuid):
            return {
                "message": f"An item with this uuid already exists."
            }, 400

        data = Item.parser.parse_args()
        item = ItemModel(data["name"], uuid, data['model_num'], data['inventory'], data["warehouse_id"])
        try:
            item.save_to_db()
        except:
            return {"message": "An error occurred creating the item."}, 500
    
        return item.json(), 201
    
    def delete(self, uuid):
        item = ItemModel.find_by_uuid(uuid)
        if(item):
            item.delete_from_db()
            return {"message": "Item deleted."}
        return {"message": "Item not found."}, 404
    
    def put(self, uuid):
        data = Item.parser.parse_args()
        name = data["name"]
        inventory = data["inventory"]
        model_num = data["model_num"]
        warehouse_id = data["warehouse_id"]
        
        item = ItemModel.find_by_uuid(uuid)
        
        if item:
            item.name = name
            item.inventory = inventory
            item.model_num = model_num
            item.warehouse_id = warehouse_id
        else:
            item = ItemModel(name, uuid, model_num, inventory, warehouse_id)
        
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