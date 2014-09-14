import json
import pickle
import sys

from os import path

from functools import wraps
from flask import *
from transaction import Transaction
from bucket import Bucket
import bucket
import transaction
DATA_FNAME = '/tmp/data.p'

app = Flask(__name__)

app.config['DEBUG'] = True
app.config['PROPAGATE_EXCEPTIONS'] = True
app.config['TRAP_BAD_REQUEST_ERRORS'] = True

def map_b2t():
    out = {}
    for b in g.data["buckets"] :
        out[b.name] = []
        for t in g.data["transactions"]:
            for x in t.buckets :
                if x[0] == b :
                    out[b.name].append(t.json())
                    break
    return out
        

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")

@app.route('/budget', methods=['GET', 'POST'])
def budget():
    return render_template("budget.html")

@app.route('/investments', methods=['GET', 'POST'])
def investments():
    return render_template("investments.html")

@app.route('/transactions',methods=['GET',"POST"])
def transactions():
    if request.method == "POST":
        tmap = json.loads(request.get("body"))
        g.data["transactions"].extend(map(lambda x : transaction.create, tmap))
    print g.data
    return json.dumps(map(Transaction.json,g.data["transactions"]))
@app.route('/bucketset',methods=["GET","POST"])
def bucketset():
    ident = int(request.args.get("ident"))
    t = g.data["transactions"][0]
    for ti in g.data["transactions"]:
        if ti.ident == ident:
            t = ti
    t.bucketset(request.args.get("buckets"))
    return str(t)
@app.route('/buckets',methods=["GET","POST"])
def buckets():
    if "type" in request.args:
        t = request.args.get("type")
        print t
        if t == "remove" :
            ident = int(request.args.get("ident"))
            for b in g.data["buckets"]:
                if b.ident == ident:
                    b.active = False
        elif t == "add" :
            g.data["buckets"].append(Bucket(request.args.get("name"),len(g.data["buckets"])))
    return json.dumps(map(Bucket.json,g.data["buckets"]))

@app.route("/bucketmap",methods=["GET"])
def bucketmap():
    return json.dumps(map_b2t())

@app.route("/ingest",methods=["GET"])
def ingest():
    with open(request.args.get("fname"),"r") as fil:
        g.data["transactions"].extend(map(transaction.create,json.load(fil)))
    g.data["transactions"].sort(key =lambda x : x.date)
    return ":-}"

@app.route('/month-transactions-per-bucket.json',methods=['GET'])
def month_transactions_per_bucket():
    d = {}
    a1 = []
    for e in g.data['transactions']:
        #today = datetime.date.today()
        #first = datetime.date(day=1, month=today.month, year=today.year)
        #lastMonth = first - datetime.timedelta(days=30)

        date = time.mktime(time.strptime(e.metadata['Post Dt'], "%m/%d/%Y"))
        #if date < lastMonth:
            #continue

        entry = [int(date)*1000, e.amount]
        bname = str(e.metadata['Merchant Type'])[0:15]
        if bname in d:
            d[bname].append(entry)
        else:
            d[bname] = [entry]

    a = []
    for key in d:
        if key != "#N/A":
            d[key].sort(key=lambda x: x[0])
            a.append({"key": key, "values": d[key]})
    return json.dumps(random.sample(a, 5))

@app.before_request
def before_request():
    """instantiates a new dataobject and stores it as a global variable"""
    if path.isfile(DATA_FNAME):
        g.data = pickle.load(open(DATA_FNAME, "rb"))
    else:
        g.data = {"transactions":[],"buckets":bucket.defaults.values()}

@app.teardown_request
def teardown_request(exception):
    """writes the data file"""
    data = getattr(g, 'data', None)
    if data is not None:
        pickle.dump(data, open(DATA_FNAME, "wb"))

if __name__ == "__main__":
    if len(sys.argv) == 1:
        app.run(host="0.0.0")
    else:
        typ = sys.argv[1]
        fname = sys.argv[2]

        f = json.loads(open(fname, "r").read())

        if typ == "credit":
            for e in f:
                t = Transaction(e['Merchant Name'], e['Transaction Amount'])

        for x in f:
            print x
            print ""
