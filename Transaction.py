import json

class Transaction():
    def __init__(name, amount, meta):
        self.name = name
        self.amount = amount
        self.metadata = meta

    def __string__():
        return json.dumps({'name': self.name,
            'amount': self.amount,
            'metadata': self.metadata})
