#!/usr/bin/env python

import os
import re
#import xively
import subprocess
import time
import datetime
import httplib
import urllib
import sys

import MySQLdb

temperature = 0
humidity = 0

# extract feed_id and api_key from environment variables
#API_KEY = "MY_THINGSPEAK_API_KEY" #CHANGE THE KEY
DEBUG = True

# Run the DHT program to get the humidity and temperature readings!
def read_dht():
    global temperature, humidity
    error = 0
    
    try:
        output = subprocess.check_output(["./Adafruit_DHT", "11", "4"]);
    except:
        error = 1
    finally:
        if (error == 0):
            matches = re.search("Temp =\s+([0-9.]+)", output)
            if (matches):
                temperature = float(matches.group(1))
            
            matches = re.search("Hum =\s+([0-9.]+)", output)
            if (matches):
                humidity = float(matches.group(1))
    if DEBUG:
      print "Temperature: %.1f C" % temperature
      print "Humidity:    %.1f %%" % humidity

    # In case of error = 1 stays with the last temperature and humidity values
    return {'temperature':temperature,'humidity':humidity}
    #time.sleep(10)

#Uncomment to send to db  
  
def dbInsert (temp, hum):
  # Open database connection
  db = MySQLdb.connect("localhost","root","Thegizmo@1982","VAS-BETA" )

  # prepare a cursor object using cursor() method
  cursor = db.cursor()

  # Prepare SQL query to INSERT a record into the database.
  sql = "INSERT INTO data_TH-A(Temp, Hum) \
         VALUES ('%s', '%s')" % \
         (temp, hum)
  try:
     # Execute the SQL command
     cursor.execute(sql)
     # Commit your changes in the database
     db.commit()
  except:
     # Rollback in case there is any error
     db.rollback()

  # disconnect from server
  db.close()


def run():
  if DEBUG:
     print "Starting ThingSpeak DHT script"

  while True:
    dhtdata = read_dht()
    
    if dhtdata['temperature'] > 0: #To avoid sending Temp=0 when Rasp Pi starts
       dbInsert(dhtdata['temperature'], dhtdata['humidity']) #Uncomment to send to db

    if DEBUG:
        print "Updating ThingSpeak feed with temperature: %.1f C" % dhtdata['temperature']
        print "Updating ThingSpeak feed with humidity: %.1f percent" % dhtdata['humidity']

      params = urllib.urlencode({'field1': dhtdata['temperature'], 'field2': dhtdata['humidity']})
      headers = {"Content-type": "application/x-www-form-urlencoded","Accept": "text/plain"}
    
      # This way it doesn't blow
      try:
          conn = httplib.HTTPConnection("api.thingspeak.com:80")
          conn.request("POST", "/update?key=MY_THINGSPEAK_API_KEY", params, headers) #CHANGE THE KEY
          response = conn.getresponse()
          data = response.read()
          conn.close()
      except:
          if DEBUG:
              print "Error"
      finally:
          if DEBUG:
              print response.status, response.reason
    else:
      print "Temperature < 0"
    time.sleep(30)

run()

