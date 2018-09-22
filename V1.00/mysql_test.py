#!/usr/bin/python
import MySQLdb
import subprocess
import re
import sys
import time
import datetime
import Adafruit_DHT

# Open database connection
conn = MySQLdb.connect("192.168.200.254","testdb","testdb","playground")

# Continuously append data
while(True):

	date = time.strftime("%d/%m/%Y")
	clock = time.strftime("%H:%M")
#  Run the DHT program to get the humidity and temperature readings!

#	output = subprocess.check_output(["/home/pi/Adafruit_Python_DHT/Adafruit_DHT", "11", "4"]);
	output = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)

 #print output
	matches = re.search("Temp =\s+([0-9.]+)", output)
	if (not matches): 
		time.sleep(0) 
		continue
	temp = float(matches.group(1))

 # search for humidity printout
	matches = re.search("Hum =\s+([0-9.]+)", output)
	if (not matches): 
		time.sleep(0) 
		continue
	humidity = float(matches.group(1))

	print "T %.1f " % temp
	print "H %.1f " % humidity

# MYSQL DATA Processing
	c = conn.cursor()

	c.execute("INSERT INTO data_TH-A (date, clock, temp, hum) VALUES (%s, %s, %s, %s)",
	(date, clock, temp, humidity))

	print "DB Loaded"
	
	time.sleep(30)
