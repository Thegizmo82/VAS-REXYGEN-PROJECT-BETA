#!/usr/bin/python

import Adafruit_DHT
import socket
import struct
import time

UVA = 5
UVB = 6
CAVE = 16
UTH = 17
while True:

        humidity, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.AM2302, CAVE)
        temperature = temperature * 9/5.0 + 32
        f_temp = open('/rex/data/ramdisk/CAVE_TEMP.txt', 'w')
        f_temp.write('%.4f \n' % (temperature))   #writes temperature in specified txt file
        f_temp.close()
        f_humid = open('/rex/data/ramdisk/CAVE_HUMID.txt', 'w')
        f_humid.write('%.4f \n' % (humidity))   #writes humidity in specified txt file
        f_temp.close()

	time.sleep(5)
