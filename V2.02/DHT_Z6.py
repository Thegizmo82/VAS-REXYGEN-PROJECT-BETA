#!/usr/bin/python
# DHT_Z6.py

# Modules to import:
import Adafruit_DHT
import socket
import struct
import time
import socket
import struct
import os

# CREATE RAM-DISK SUB-DIRECTORY IF DOES NOT EXIST
try:
    os.makedirs ('/rex/data/ramdisk/dht_z6')
except OSError:
    if not os.path.isdir ('/rex/data/ramdisk/dht_z6'):
        raise

# Sensor should be set to , Adafruit_DHT.DHT11 
# Adafruit_DHT.DHT22, or Adafruit_DHT.AM2302.
# sensor = Adafruit_DHT.AM2302
# READ SENSOR TYPE FILE FROM REX CORE 
file_SENSOR = open('/rex/data/static/DHT_Z6_SENSOR.txt', 'r')
sensor_data = file_SENSOR.read()
file_SENSOR.close()

# REX SENSOR SELECTION

if sensor_data == 0:
	sensor = Adafruit_DHT.DHT11
elif sensor_data == 1:
	sensor = Adafruit_DHT.DHT22
elif sensor_data == 2:
	sensor = Adafruit_DHT.AM2302
else: 
	sensor = Adafruit_DHT.AM2302



# Example using a Raspberry Pi with DHT sensor
# connected to GPIO23.
# pin = 5
# READ PIN ASIGNMENT FILE FROM REX CORE
file_PIN = open('/rex/data/static/DHT_Z6_PIN.txt', 'r')
pin = file_PIN.read()
file_PIN.close()

# Try to grab a sensor reading.  Use the read_retry method which will retry up
# to 15 times to get a sensor reading (waiting 2 seconds between each retry).
humidity, temperature = Adafruit_DHT.read_retry(sensor, pin)

# CONVERT TEMPERATURE TO F
temperature_f = temperature * 9/5.0 + 32

# WRITE TEMPERATURE TO FILE
file_temperature = open('/rex/data/ramdisk/dht_z6/TC.txt', 'w')
file_temperature.write('%.4f \n' % (temperature))   #writes temperature in specified txt file
file_temperature.close()

# WRITE TEMPERATURE IN F TO FILE
file_temperature_f = open('/rex/data/ramdisk/dht_z6/TF.txt', 'w')
file_temperature_f.write('%.4f \n' % (temperature_f))   #writes temperature in specified txt file
file_temperature_f.close()

# WRITE HUMIDITY TO FILE
file_humidity = open('/rex/data/ramdisk/dht_z6/RH.txt', 'w')
file_humidity.write('%.4f \n' % (humidity))   #writes humidity in specified txt file
file_humidity.close()
