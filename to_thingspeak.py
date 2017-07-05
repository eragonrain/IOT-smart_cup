import sys
import time
import httplib, urllib

sys.path.insert(0, '/usr/lib/python2.7/bridge/')
from bridgeclient import BridgeClient as bridgeclient
value = bridgeclient()
thinkSpeakApiKey = "3VLVQAFCWCMMTYAJ"




def post_to_thingspeak(payload):
    headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
    not_connected = 1
    while (not_connected):
        try:
            conn = httplib.HTTPConnection("api.thingspeak.com:80")
            conn.connect()
            not_connected = 0
        except (httplib.HTTPException, socket.error) as ex:
            print "Error: %s" % ex
            time.sleep(10)  # sleep 10 seconds

    conn.request("POST", "/update", payload, headers)
    response = conn.getresponse()
    print( response.status, response.reason, payload, time.strftime("%c"))
    data = response.read()
    conn.close()

while True:
    t0 = value.get("X-axis")
    #print "X-axis: " + t0
    t1 = value.get("Y-axis")
    #print "Y-axis: " + t1
    t2 = value.get("Z-axis")
    #print "Z-axis: " + t2
    h0 = value.get("Water_Height")
    #print "Water_Height: " + h0
    params = urllib.urlencode({'field1': t0, 'field2': t1, 'field3': t2, 'field4': h0, 'key': thinkSpeakApiKey})
    post_to_thingspeak(params)
    time.sleep(5)
