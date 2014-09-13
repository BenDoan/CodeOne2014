import json



class Bucket():
    def __init__(self,name,ident=None,active=True):
        self.name = name
        if ident is None :
            self.ident = -1 #fix
        else :
            self.ident = ident
        self.active = active
    def json(self):
        return {"ident":self.ident,"name":self.name,"active":self.active}
