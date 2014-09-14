import json
import time
import bucket
import hashlib


dumbfields = ["name","description","id","amount","metadata","account","date"]
def create(json):
    print bucket.mapping
    buckets = []
    imap = {}
    dmap = {
        "Trans Desc":"name",
        "Tran Detail Desc":"description",
        "id":"id",
        "Acct Nbr":"account",
        "Post Dt":"date"}
    for x in dmap :
        imap[dmap[x]] = json[x]
    imap["date"] = time.mktime(time.strptime(imap["date"],"%m/%d/%Y"))
    imap["metadata"] = json
    imap["amount"] = int(100*float(json["Tran Amt"]))
    imap["key"] = hashlib.md5(str(imap["account"])+"-"+str(imap["id"])).hexdigest()
    if json["Category"] in bucket.mapping:
        print "YEP"
        buckets.append([bucket.mapping[json["Category"]],1.0])
    imap["buckets"] = buckets
    return Transaction(**imap)
class Transaction():
    def __init__(self,buckets = [],key = "",**kwargs):
        print(buckets)
        self.dat = {}
        for f in dumbfields :
            self.__dict__[f] = kwargs[f]
        self.buckets = buckets
        self.key = key
    def __str__(self):
        return json.dumps(self.json())
    def json(self):
        out = {}
        for f in dumbfields :
            out[f] = self.__dict__[f]
        out["key"] = self.key
        out["buckets"]=map(lambda x : [x[0].name,x[1]],self.buckets)
        return out
