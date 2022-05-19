from db import db

# A warehouse should contain a name and a location
# There should not be multiple warehouses with the same name or location

class WarehouseModel(db.Model):
    __tablename__ = "warehouses"
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80))
    location = db.Column(db.String(100))
    
    items = db.relationship("ItemModel", lazy="dynamic")
    
    def __init__(self, name, location):
        self.name = name
        self.location = location
    
    def __str__(self):
        return self.name
    
    def json(self):
        return {
            'id': self.id,
            'name': self.name,
            "location": self.location,
            "items": [item.json() for item in self.items.all()]
        }

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()
        
    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()
    
    @classmethod
    def find_by_name(cls, name):
        return cls.query.filter_by(name=name).first()

    @classmethod
    def find_by_location(cls, location):
        return cls.query.filter_by(location=location).first()
