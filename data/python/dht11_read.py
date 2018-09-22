#!/usr/bin/python

import Adafruit_DHT
import socket
import struct
import time

UVA = 24
UVB = 25
CAVE = 26
while True:
	humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, UVA)
	f_temp = open('/rex/data/ramdisk/uva_temp.txt', 'w')
	f_temp.write('%.4f \n' % (temperature))   #writes temperature in specified txt file

	f_humid = open('/rex/data/ramdisk/uvb_humid.txt', 'w')
	f_humid.write('%.4f \n' % (humidity))   #writes humidity in specified txt file
	time.sleep(5)


