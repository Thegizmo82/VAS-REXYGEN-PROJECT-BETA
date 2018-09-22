#!/usr/bin/env python
# ephem_updater_template.py
# Modules to import:
import datetime
import time
import ephem # to install, type$ pip install pyephem
import socket
import struct

# Calculate what time it is now:
nowtd = datetime.datetime.now()
nowtd_hours = time.localtime(time.time())[3]
nowtd_minutes = time.localtime(time.time())[4]
nowtd_time = datetime.datetime.now().strftime('%H:%M')
nowtd_time_h = datetime.datetime.now().strftime('%H')
nowtd_time_m = datetime.datetime.now().strftime('%M')
nowtd_time_s = datetime.datetime.now().strftime('%S')

file_LAT = open('static/LAT.txt', 'r')
LAT = file_LAT.read()
file_LAT.close()

file_LON = open('static/LON.txt', 'r')
LON = file_LON.read()
file_LON.close()

# Observer Settings:
eos=ephem.Observer()
eos.pressure = 0
eos.horizon = '-6'
eos_is_rise = True
eos_is_sun = True
eos_is_center = use_center=True
eos.lat = LAT
eos.lon = LON
eos.date = datetime.date.today()
eos_next_event = eos.next_rising if eos_is_rise else eos.next_setting
eos_sun_moon = ephem.Sun() if eos_is_sun else ephem.Moon()

# Sun or Moon PyEphem Selection: 
sun = ephem.Sun()
moon = ephem.Moon()

# Observer:
eos_time = (eos_next_event(eos_sun_moon, use_center=True))

print eos_time

ldt = ephem.localtime(eos_time)
print ldt

lt_h = ephem.localtime(eos_time).strftime('%H')
lt_m = ephem.localtime(eos_time).strftime('%M')
lt_s = ephem.localtime(eos_time).strftime('%S')
ld_m = ephem.localtime(eos_time).strftime('%m')
ld_d = ephem.localtime(eos_time).strftime('%d')
ld_y = ephem.localtime(eos_time).strftime('%Y')
ld_wd = ephem.localtime(eos_time).strftime('%w')
ld_dy = ephem.localtime(eos_time).strftime('%j')
ld_wy = ephem.localtime(eos_time).strftime('%W')
ldt_s = ephem.localtime(eos_time).strftime('%c')

print lt_h
print lt_m
print lt_s
print ld_m
print ld_d
print ld_y
print ld_wd
print ld_dy
print ld_wy
print ldt_s
