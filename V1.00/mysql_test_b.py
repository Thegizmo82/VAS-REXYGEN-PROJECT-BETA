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

date = time.strftime("%d/%m/%Y")
clock = time.strftime("%H:%M")
#  Run the DHT program to get the humidity and temperature readings!

#output = subprocess.check_output(["/home/pi/Adafruit_Python_DHT/Adafruit_DHT", "11", "4"]);
output = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 3)

#print 'Temp={0:0.1f}*  Hum={1:0.1f}%'.format(temperature, humidity)


 #print output
matches = re.search("Temp=0:0.1f", output)
if (not matches): time.sleep(0) #continue
temperature = float(matches.group(1))

 # search for humidity printout
matches = re.search("Hum=1:0.1f", output)
if (not matches): time.sleep(0) #continue
humidity = float(matches.group(1))

# MYSQL DATA Processing
c = conn.cursor()

c.execute("INSERT INTO data_TH-A (date, clock, temp, hum) VALUES (%s, %s, %s, %s)",
(date, clock, temperature, humidity))

print "DB Loaded"
	
#time.sleep(30)
