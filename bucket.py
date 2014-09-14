import json
class Bucket():
    def __init__(self,name,mutable=True,active=True):
        self.name = name
        self.active = active
        self.mutable = mutable
        val = 0
        for c in self.name :
            val += ord(c)
        self.color = "hsl("+str(255*((val*135)%251)/251.0)+",100%,50%)"
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


