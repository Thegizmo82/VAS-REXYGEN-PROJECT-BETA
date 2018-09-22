#!/usr/bin/env python
import MySQLdb
import subprocess
import re
import sys
import time
import datetime
import Adafruit_DHT

# Sensor should be set to Adafruit_DHT.DHT11,
# Adafruit_DHT.DHT22, or Adafruit_DHT.AM2302.
sensor_z1 = Adafruit_DHT.DHT11
sensor_z2 = Adafruit_DHT.DHT11
sensor_z3 = Adafruit_DHT.DHT11
sensor_z4 = Adafruit_DHT.DHT11

# Zone assessment
pin_z1 = 2
pin_z2 = 2
pin_z3 = 2
pin_z4 = 2

temperature = 1
humidity = 2

# DBASE connection setup:
DBASE_Address = '192.168.200.254'
DBASE_USER = 'testdb'
DBASE_PASS = 'testdb'
DBASE_NAME = 'VAS-BETA'
DBASE_TABZ1 = 'data_TH_z1'
DBASE_TABZ2 = 'data_TH_z2'
DBASE_TABZ3 = 'data_TH_z3'
DBASE_TABZ4 = 'data_TH_z4'

DEBUG = True

if DEBUG:
	print "Program Startup Normal"

# Run the DHT program to get the humidity and temperature readings for zone 1!
def read_dht_z1():
    global temperature, humidity
    error = 0

    try:
        #output = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
	humidity, temperature = Adafruit_DHT.read_retry(sensor_z1, pin_z1)
        # Uncomment next line for Degree in Fahrenheit:
	temperature = temperature * 9/5.0 + 32
    except:
        error = 1
	print 'ERROR'
    finally:
	if DEBUG:
		if	humidity is not None and temperature is not None:
        		print 'Temperature and Humidity reading ok'
		else:
        		print 'Failed to get reading. Try again!'
        		#sys.exit(1)        
    if DEBUG:
      print "Temperature: %.1f F" % temperature
      print "Humidity:    %.1f %%" % humidity
    # In case of error = 1 stays with the last temperature and humidity values
    return {'temperature':temperature,'humidity':humidity}
    #time.sleep(10)

# Run the DHT program to get the humidity and temperature readings for zone 2!
def read_dht_z2():
    global temperature, humidity
    error = 0

    try:
        #output = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
	humidity, temperature = Adafruit_DHT.read_retry(sensor_z2, pin_z2)
        # Uncomment next line for Degree in Fahrenheit:
	temperature = temperature * 9/5.0 + 32
    except:
        error = 1
	print 'ERROR'
    finally:
	if DEBUG:
		if	humidity is not None and temperature is not None:
        		print 'Temperature and Humidity reading ok'
		else:
        		print 'Failed to get reading. Try again!'
        		#sys.exit(1)        
    if DEBUG:
      print "Temperature: %.1f F" % temperature
      print "Humidity:    %.1f %%" % humidity
    # In case of error = 1 stays with the last temperature and humidity values
    return {'temperature':temperature,'humidity':humidity}
    #time.sleep(10)

# Run the DHT program to get the humidity and temperature readings for zone 3!
def read_dht_z3():
    global temperature, humidity
    error = 0

    try:
        #output = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
	humidity, temperature = Adafruit_DHT.read_retry(sensor_z3, pin_z3)
        # Uncomment next line for Degree in Fahrenheit:
	temperature = temperature * 9/5.0 + 32
    except:
        error = 1
	print 'ERROR'
    finally:
	if DEBUG:
		if	humidity is not None and temperature is not None:
        		print 'Temperature and Humidity reading ok'
		else:
        		print 'Failed to get reading. Try again!'
        		#sys.exit(1)        
    if DEBUG:
      print "Temperature: %.1f F" % temperature
      print "Humidity:    %.1f %%" % humidity
    # In case of error = 1 stays with the last temperature and humidity values
    return {'temperature':temperature,'humidity':humidity}
    #time.sleep(10)

# Run the DHT program to get the humidity and temperature readings for zone 4!
def read_dht_z4():
    global temperature, humidity
    error = 0

    try:
        #output = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
	humidity, temperature = Adafruit_DHT.read_retry(sensor_z4, pin_z4)
        # Uncomment next line for Degree in Fahrenheit:
	temperature = temperature * 9/5.0 + 32
    except:
        error = 1
	print 'ERROR'
    finally:
	if DEBUG:
		if	humidity is not None and temperature is not None:
        		print 'Temperature and Humidity reading ok'
		else:
        		print 'Failed to get reading. Try again!'
        		#sys.exit(1)        
    if DEBUG:
      print "Temperature: %.1f F" % temperature
      print "Humidity:    %.1f %%" % humidity
    # In case of error = 1 stays with the last temperature and humidity values
    return {'temperature':temperature,'humidity':humidity}
    #time.sleep(10)


def dbInsert_z1 (temperature, humidity):
  # Open database connection
  date = time.strftime("%y/%m/%d")
  clock = time.strftime("%H:%M:%S")
  
  db = MySQLdb.connect(DBASE_Address,DBASE_USER,DBASE_PASS,DBASE_NAME)

  # prepare a cursor object using cursor() method
  cursor = db.cursor()

  # Prepare SQL query to INSERT a record into the database.
  sql = "INSERT INTO DBASE_TABZ1(THA_date, THA_time, THA_temp, THA_hum) \
         VALUES ('%s', '%s', '%s', '%s')" % \
         (date, clock, temperature, humidity)
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

def dbInsert_z2 (temperature, humidity):
  # Open database connection
  date = time.strftime("%y/%m/%d")
  clock = time.strftime("%H:%M:%S")
  
  db = MySQLdb.connect(DBASE_Address,DBASE_USER,DBASE_PASS,DBASE_NAME)

  # prepare a cursor object using cursor() method
  cursor = db.cursor()

  # Prepare SQL query to INSERT a record into the database.
  sql = "INSERT INTO DBASE_TABZ2(THA_date, THA_time, THA_temp, THA_hum) \
         VALUES ('%s', '%s', '%s', '%s')" % \
         (date, clock, temperature, humidity)
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

def dbInsert_z3 (temperature, humidity):
  # Open database connection
  date = time.strftime("%y/%m/%d")
  clock = time.strftime("%H:%M:%S")
  
  db = MySQLdb.connect(DBASE_Address,DBASE_USER,DBASE_PASS,DBASE_NAME)

  # prepare a cursor object using cursor() method
  cursor = db.cursor()

  # Prepare SQL query to INSERT a record into the database.
  sql = "INSERT INTO DBASE_TABZ3(THA_date, THA_time, THA_temp, THA_hum) \
         VALUES ('%s', '%s', '%s', '%s')" % \
         (date, clock, temperature, humidity)
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

def dbInsert_z4 (temperature, humidity):
  # Open database connection
  date = time.strftime("%y/%m/%d")
  clock = time.strftime("%H:%M:%S")
  
  db = MySQLdb.connect(DBASE_Address,DBASE_USER,DBASE_PASS,DBASE_NAME)

  # prepare a cursor object using cursor() method
  cursor = db.cursor()

  # Prepare SQL query to INSERT a record into the database.
  sql = "INSERT INTO DBASE_TABZ4(THA_date, THA_time, THA_temp, THA_hum) \
         VALUES ('%s', '%s', '%s', '%s')" % \
         (date, clock, temperature, humidity)
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
     print "Starting: Logging to MySQL"

  while True:
    dhtdata_z1 = read_dht_z1()
    
    if dhtdata_z1['temperature'] > 0: #To avoid sending Temp=0 when Rasp Pi starts
       dbInsert_z1(dhtdata_z1['temperature'], dhtdata_z1['humidity'])

    if DEBUG:
        print "Updating ZONE1 MySQL with temperature: %.1f F" % dhtdata_z1['temperature']
        print "Updating ZONE1 MySQL with humidity: %.1f percent" % dhtdata_z1['humidity']

    dhtdata_z2 = read_dht_z2()
    
    if dhtdata_z2['temperature'] > 0: #To avoid sending Temp=0 when Rasp Pi starts
       dbInsert_z2(dhtdata_z2['temperature'], dhtdata_z2['humidity'])

    if DEBUG:
        print "Updating ZONE2 MySQL with temperature: %.1f F" % dhtdata_z2['temperature']
        print "Updating ZONE2 MySQL with humidity: %.1f percent" % dhtdata_z2['humidity']

    dhtdata_z3 = read_dht_z3()
    
    if dhtdata_z3['temperature'] > 0: #To avoid sending Temp=0 when Rasp Pi starts
       dbInsert_z3(dhtdata_z3['temperature'], dhtdata_z3['humidity'])

    if DEBUG:
        print "Updating ZONE3 MySQL with temperature: %.1f F" % dhtdata_z3['temperature']
        print "Updating ZONE3 MySQL with humidity: %.1f percent" % dhtdata_z3['humidity']

    dhtdata_z4 = read_dht_z4()
    
    if dhtdata_z4['temperature'] > 0: #To avoid sending Temp=0 when Rasp Pi starts
       dbInsert_z4(dhtdata_z4['temperature'], dhtdata_z4['humidity'])

    if DEBUG:
        print "Updating ZONE4 MySQL with temperature: %.1f F" % dhtdata_z4['temperature']
        print "Updating ZONE4 MySQL with humidity: %.1f percent" % dhtdata_z4['humidity']
        
    time.sleep(30)

run()
