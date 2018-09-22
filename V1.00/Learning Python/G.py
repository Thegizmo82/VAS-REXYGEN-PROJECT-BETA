#!/usr/bin/env python
# program calculates sunset each day and turns the lamp on 30 minutes before

# then the program calculates a random minute to turn the lamp off within an hour after midnight.



# REMEMBER TO USE 24-HOUR TIME FORMAT

# AND THAT PYEPHEM USES UTC/GMT AND NOT EST

import time
import datetime
import ephem
import random
#import RPi.GPIO as GPIO 

#GPIO.setmode(GPIO.BOARD) 
#GPIO.setup(10, GPIO.OUT) 

# make sure "off_minutes" has a value
off_minutes = 1

while 1:
# figure out what time it is now
    now = datetime.datetime.now()
    now_hours = time.localtime(time.time())[3]
    now_minutes = time.localtime(time.time())[4]
# provide the program with information about the current location:
# HS = Hobe Sound
HS=ephem.Observer()
HS.lat='31.166667'
HS.lon='-81.483333'
HS.date = now
sun = ephem.Sun() 
# figure out if it is daylight savings time or not:
# isdst will be 1 if DST is currently enforced, 0 otherwise
isdst = time.localtime().tm_isdst
# figure out when sunset is:
sunset_hours = HS.next_setting(sun).tuple()[3]
#sunset_hours will be in 24-hour GMT.
if isdst == 1: #add 20 to the time for DST
    sunset_hours = sunset_hours + 20
else: #add 19 to the time for EST
    sunset_hours = sunset_hours + 19
    sunset_minutes = HS.next_setting(sun).tuple()[4]
print now_hours
# subtract 30 minutes from the time since it gets dark before actual sunset
#    sunset_minutes = sunset_minutes - 30
#if sunset_minutes < 0:
#    sunset_hours = sunset_hours - 1
#sunset_mintues will be a negative number, so adding it to 60 will subtract it
#    sunset_minutes = 60 + sunset_minutes
# turn the light on if the hours and minutes match:
if now_hours >= sunset_hours and now_minutes >= sunset_minutes:
    print 'system on'
#also calculate a random time for the light to turn off
#this is in this "if" statement so it only calculates a random time once
#every 24 hours. 
off_minutes = random.randint(0,59)
# turn the light off at the randomly selected minute in the 00 (midnight-1:00 AM) hour
if now_hours == 2 and now_minutes == 51:
    print 'system off'

# run once every 30 seconds:

time.sleep(30)
