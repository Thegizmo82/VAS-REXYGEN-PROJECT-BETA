#!/usr/bin/python
import MySQLdb
import subprocess
import re
import sys
import time
import datetime
import Adafruit_DHT

# Parse command line parameters.
sensor_args = { '11': Adafruit_DHT.DHT11,
                                '22': Adafruit_DHT.DHT22,
                                '2302': Adafruit_DHT.AM2302 }
if len(sys.argv) == 3 and sys.argv[1] in sensor_args:
        sensor = sensor_args[sys.argv[1]]
        pin = sys.argv[2]
else:
        print 'usage: sudo ./Adafruit_DHT.py [11|22|2302] GPIOpin#'
        print 'example: sudo ./Adafruit_DHT.py 2302 4 - Read from an AM2302 connected to GPIO #4'
        sys.exit(1)

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

db = MySQLdb.connect("localhost", "root", "Thegizmo@1982", "temps")

# prepare a cursor object using cursor() method
curs=db.cursor()

# Prepare SQL query to INSERT a record into the database.
#try:
curs.execute ("INSERT INTO tempdat (tdate, ttime, temp, hum) VALUES (%s, %s, %s, %s)",
(date, clock, temperature, humidity))

db.commit()
print "Data committed"

#except:
#    print "Error: the database is being rolled back"
#    db.rollback()

