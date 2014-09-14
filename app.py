import json
import pickle
import sys
import time
import random

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

def last20backwards():
    return reversed(g.data["transactions"][-20:0])

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template("index.html")

@app.route('/budget', methods=['GET', 'POST'])
def budget():
    return render_template("budget.html")

@app.route('/investments', methods=['GET', 'POST'])
def investments():
    return render_template("investments.html")

@app.route('/loans', methods=['GET', 'POST'])
def loans():
    return render_template("debt.html")

@app.route('/add_bucket', methods=['GET', 'POST'])
def add_bucket():
    return render_template("add_bucket.html")

@app.route('/action_add_bucket', methods=['GET', 'POST'])
def action_add_bucket():
    if " " not in request.form['name']:
        g.data['buckets'].append(Bucket(request.form['name']))
    return redirect("/budget")

@app.route('/budget_val_ingest', methods=['GET', 'POST'])
def budget_val_ingest():
    print(request.form)
    for bucket in g.data['buckets']:
        if bucket.name == request.form['name']:
            bucket.value = int(request.form['value'])
    return ""

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


def get_bucket(ident):
    for b in g.data["buckets"]:
        if b.ident == ident :
            return b
    return None

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
        g.data["transactions"].extend(map(transaction.create,filter(lambda x : x["Category"]!="Paycheck" and x["Category"]!="Returned Purchase",json.load(fil))))
    g.data["transactions"].sort(key =lambda x : x.date)
    return "ingest finished"

@app.route('/dailyhist',methods=["GET"])
def dailyhist():
    out = {}
    def tfunc(t):
        return int(t/604800)*604800
    for x in g.data["buckets"] :
        out[x.name]={}
    out["unknown"]={}
    for t in g.data["transactions"] :
        remainder = t.amount
        d = tfunc(t.date)
        for b in g.data["buckets"] :
            if d not in out[b.name] :
                out[b.name][d] = 0
        for b in t.buckets :
            out[b[0].name][d] += b[1]*t.amount
            remainder -= b[1]*t.amount
        if d not in out["unknown"]:
            out["unknown"][d] = 0
        out["unknown"][d] += remainder
    rout = []
    for k in out :
        tmp = []
        for x in out[k] :
            tmp.append({"x":x,"y":out[k][x]/100.0})
        tmp.sort(key=lambda x:x["x"])
        rout.append({"key":k,"values":tmp,"color":"#7f7f7f"})
        for x in g.data["buckets"]:
            if x.name == k:
                rout[-1]["color"] = x.color
                break
    print rout
    return json.dumps(rout)


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

@app.route('/bucket-values.json',methods=['GET'])
def getBucketValues():
    a = []
    for b in g.data['buckets']:
        if b.value > 0:
            a.append({"label": b.name, "value": b.value,"color":b.color})
    return json.dumps(a)

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
