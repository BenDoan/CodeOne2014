import json

class Transaction():
    def __init__(self,ident,name, amount, metadata, buckets = []):
        self.ident = ident
        self.name = name
        self.amount = amount
        self.metadata = metadata
        self.buckets = buckets
    def bucketset(self,val):
        self.buckets = json.loads(val)
    def __str__(self):
        return json.dumps(self.json())
    def json(self):
        return {"ident":self.ident,
            "name": self.name,
            "amount": self.amount,
            "buckets": self.buckets,
            "metadata": self.metadata}
