#!/usr/bin/python
import MySQLdb
import subprocess
import re
import sys
import time
import datetime
import Adafruit_DHT

# Open database connection
conn = MySQLdb.connect("localhost","root","Thegizmo@1982","VAS-BETA")

# Continuously append data
#while(True):

#date = time.strftime("%d/%m/%Y")
#clock = time.strftime("%H:%M")
#  Run the DHT program to get the humidity and temperature readings!

#output = subprocess.check_output(["/home/pi/Adafruit_Python_DHT/Adafruit_DHT"]);
output = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 3)

 #print output
matches = re.search("Temp =\s+([0-9.]+)", output)
if (not matches): time.sleep(0) #continue
temp = float(matches.group(1))


 # search for humidity printout
matches = re.search("Hum =\s+([0-9.]+)", output)
if (not matches): time.sleep(0) #continue
hum = float(matches.group(1))

print "T %.1f " % temp
print "H %.1f " % hum

# MYSQL DATA Processing
c = conn.cursor()

c.execute("INSERT INTO data_TH-A (date, clock, temp, hum) VALUES (%s, %s, %s, %s)",
(date, clock, temp, hum))

print "DB Loaded"
	
#time.sleep(30)
