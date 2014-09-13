import json
import time
import sys

s = json.loads(open(sys.argv[1], "r").read())

#card data:
#d = {}
#for e in s:
    #d[e['Merchant Type']] = d.get(e['Merchant Type'], 0.0) + float(e['Transaction Amount'])

#del d["#N/A"]

#a = []
#for key in d:
    #a.append({"label": key, "value": d[key]})

#print(json.dumps(a[0:7]))
#print("")

#d = {}
#for e in s:
    #date = int(time.mktime(time.strptime(e['Transaction Date'], "%m/%d/%Y"))) * 1000
    #d[date] = d.get(date, 0.0) + float(e['Transaction Amount'])

#a = []
#for key in d:
    #a.append([key, d[key]])

#a.sort(key=lambda x: x[0])
#print([{"key": "Series 1", "values": a}])


a = []
for e in s:
    date = int(time.mktime(time.strptime(e['Post Dt'], "%m/%d/%Y"))) * 1000
    a.append(date)

a2 = []
for e in s:
    a2.append(float(e['Tran Amt']))


a = list(zip(sorted(a), a2))
print([{"key": "Series 1", "values": a}])
