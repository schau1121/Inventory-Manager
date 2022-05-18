from db import db
from models.warehouse import WarehouseModel

# An item should contain a name, model_num, inventory amount
# and a warehouse id
#
# there may be multiple items with the same name and model_num
# but different warehouse_ids
#
# the find_by_name_warehouse method returns a unique item
#
# the find_all_by_name method should return a list of all
# items with a matching name

class ItemModel(db.Model):
    __tablename__ = "items"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    uuid = db.Column(db.String(150))
    model_num = db.Column(db.String(50))
    inventory = db.Column(db.Integer)
    warehouse_id = db.Column(db.Integer, db.ForeignKey('warehouses.id'))
    warehouse = db.relationship("WarehouseModel")
    
    def __init__(self, name, uuid, model_num, inventory, warehouse_id):
        self.name = name
        self.uuid = uuid
        self.model_num = model_num
        self.inventory = inventory
        self.warehouse_id = warehouse_id
    
    def json(self):
        return {
            'name': self.name,
            'model_num': self.model_num,
            'inventory': self.inventory,
            "warehouse_id": self.warehouse_id,
            "warehouse": str(self.warehouse),
            "uuid": self.uuid
        }
        
    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        
    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
    
    @classmethod
    def find_by_uuid(cls, uuid):
        return cls.query.filter_by(uuid=uuid).first()

    @classmethod
    def find_by_name_warehouse(cls, name, warehouse_id):
        return cls.query.filter_by(name=name, warehouse_id=warehouse_id).first()

    @classmethod
    def find_all_by_name(cls, name):
        return cls.query.filter_by(name=name).all()