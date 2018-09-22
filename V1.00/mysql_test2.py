#!/usr/bin/python
import MySQLdb
import subprocess
import re
import sys
import time
import datetime
import Adafruit_DHT
temperature = 77
humidity = 3

# extract feed_id and api_key from environment variables
#API_KEY = "MY_THINGSPEAK_API_KEY" #CHANGE THE KEY
DEBUG = False

# Run the DHT program to get the humidity and temperature readings!
def read_dht():
    global temperature, humidity
    error = 0

    try:
#        output = subprocess.check_output(["./Adafruit_DHT", "11", "4"]);
	output - Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
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
  
  time.sleep(30)

#dbInsert()


