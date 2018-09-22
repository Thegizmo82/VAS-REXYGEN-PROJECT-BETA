#!/usr/bin/python
import MySQLdb
import subprocess
import re
import sys
import time
import datetime
import Adafruit_DHT


# Sensor should be set to Adafruit_DHT.DHT11,
# Adafruit_DHT.DHT22, or Adafruit_DHT.AM2302.
sensor = Adafruit_DHT.DHT11

# Example using a Beaglebone Black with DHT sensor
# connected to pin P8_11.
#pin = 'P8_11'

# Example using a Raspberry Pi with DHT sensor
# connected to GPIO23.
pin = 2

# Try to grab a sensor reading.  Use the read_retry method which will retry up
# to 15 times to get a sensor reading (waiting 2 seconds between each retry).
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

# Un-comment the line below to convert the temperature to Fahrenheit.
temperature = temperature * 9/5.0 + 32

# Note that sometimes you won't get a reading and
# the results will be null (because Linux can't
# guarantee the timing of calls to read the sensor).
# If this happens try again!
if humidity is not None and temperature is not None:
        print 'Temperature {0:0.1f} Humidity {1:0.1f}'.format(temperature, humidity)
else:
        print 'Failed to get reading. Try again!'
        sys.exit(1)

# MYSQL DATA Processing
# Open database connection
date = time.strftime("%y/%m/%d")
clock = time.strftime("%H:%M:%S")

db = MySQLdb.connect("localhost", "root", "Thegizmo@1982", "VAS-BETA")

# prepare a cursor object using cursor() method
curs=db.cursor()

# Prepare SQL query to INSERT a record into the database.
#try:
curs.execute ("INSERT INTO data_TH_A (tdate, ttime, temp, hum) VALUES (%s, %s, %s, %s)",
(date, clock, temperature, humidity))

db.commit()
print "Data committed"

#except:
#    print "Error: the database is being rolled back"
#    db.rollback()

