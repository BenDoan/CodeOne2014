import json
class Bucket():
    def __init__(self,name,mutable=True,active=True):
        self.name = name
        self.active = active
        self.mutable = mutable
    def __str__(self):
        return json.dumps(self.json())
    def json(self):
        return self.__dict__

defaults = {
"utility":Bucket("utilities"),
"food":Bucket("food")
}


mapping = {
"Grocery":defaults["food"],
"Restaurant":defaults["food"],
"Auto/Gas":defaults["utility"],
"Utilities":defaults["utility"]
}


