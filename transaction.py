import json

class Transaction():
    def __init__(self,name, amount, metadata):
        self.name = name
        self.amount = amount
        self.metadata = metadata

    def __str__(self):
        return json.dumps(self.dict())
    def dict(self):
        return {"name": self.name,
            "amount": self.amount,
            "metadata": self.metadata}