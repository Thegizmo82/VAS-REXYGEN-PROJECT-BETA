#!/usr/bin/env python
# time_io_ver_b2(NO IO).py
# Program calculates sunrise and sunset each day and turns the correct UBA lamps on or off.
# Program calculates Civil Twilight each day and turns the correct UBB lamps on or off.
# Program calculates Sun Transit each day.
# Program calculates Moonrise and Moonset each day.
# Program calculates Moon Transit each day.

# Modules to import:
import datetime
import time
import ephem # to install, type$ pip install pyephem
import socket
import struct

# Calculate what time it is now:
now = datetime.datetime.now()
now_hours = time.localtime(time.time())[3]
now_minutes = time.localtime(time.time())[4]
now_time = datetime.datetime.now().strftime('%H:%M')
now_time_h = datetime.datetime.now().strftime('%H')
now_time_m = datetime.datetime.now().strftime('%M')
now_time_s = datetime.datetime.now().strftime('%S')

#file_LAT = open('/rex/data/static/LAT.txt', 'r')
#LAT = file_LAT.read()
#file_LAT.close()
LAT = '31.1729'


#file_LON = open('/rex/data/static/LON.txt', 'r')
#LON = file_LON.read()
#file_LON.close()
LON = '-81.4772'

#file_TZ_OFFSET = open('/rex/data/static/TZ_OFFSET.txt', 'r')
#TZ_OFFSET = file_TZ_OFFSET.read()
#file_TZ_OFFSET.close()
#TIME = (float(TZ_OFFSET))
TIME = -5

# Start of Civil Twilight Observer Settings:
sctl=ephem.Observer()
sctl.pressure = 0
sctl.horizon = '-6'
sctl_is_rise = True
sctl.lat = LAT
sctl.lon = LON
sctl.date = datetime.date.today()
sctl_next_event = sctl.next_rising if sctl_is_rise else sctl.next_setting

# Sun or Moon PyEphem Selection: 
sun = ephem.Sun()
moon = ephem.Moon()

# Start of Civil Twilight Observer:
sctl_time = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + 0 *ephem.hour
                       ).datetime()
sctl_time_h = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + 0 *ephem.hour
                       ).datetime().strftime('%H')
# Start of Civil Twilight Observer:
sctl_time_m = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + 0 *ephem.hour
                       ).datetime().strftime('%M')

# Start of Civil Twilight Observer:
sctl_time_s = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + 0 *ephem.hour
                       ).datetime().strftime('%S')

lt = ephem.localtime(sctl_time)
    
print sctl_time

print sctl_time_h

print sctl_time_m

print sctl_time_s   

print lt

print now_time
