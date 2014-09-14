import json
class Bucket():
    def __init__(self,name,mutable=True,active=True, value=0,color=None):
        self.name = name
        self.active = active
        self.mutable = mutable
        self.value = value # percent from 0 to 1
        val = 0
        for c in self.name :
            val += ord(c)
        if color is None :
            self.color = "hsl("+str(255*((val*135)%251)/251.0)+",100%,50%)"
        else :
            self.color = color
    def __str__(self):
        return json.dumps(self.json())
    def json(self):
        return self.__dict__

defaults = {
"utility":Bucket("utilities",color="#1f77b4"),
"food":Bucket("food",color="#2ca02c"),
"cash":Bucket("cash"),
"recreation":Bucket("recreation"),
#"paycheck":Bucket("paycheck"),
"investment":Bucket("investment"),
"loan":Bucket("loan"),
"fee":Bucket("fee"),
#"return":Bucket("return")
}


mapping = {
"Grocery":defaults["food"],
"Restaurant":defaults["food"],
"Auto/Gas":defaults["utility"],
"Utilities":defaults["utility"],
"Recreation":defaults["recreation"],
"ATM / CASH":defaults["cash"],
#"Paycheck":defaults["paycheck"],
"Investment":defaults["investment"],
"Loan Payment":defaults["loan"],

"Fee":defaults["fee"],
"Service Fee":defaults["fee"],
#"Returned Purchase":defaults["return"]

}


