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

loc_hour = ephem.localtime(eos_time).strftime('%H')
loc_minute = ephem.localtime(eos_time).strftime('%M')
loc_second = ephem.localtime(eos_time).strftime('%S')
loc_month = ephem.localtime(eos_time).strftime('%m')
loc_day = ephem.localtime(eos_time).strftime('%d')
loc_year = ephem.localtime(eos_time).strftime('%Y')
loc_weekday = ephem.localtime(eos_time).strftime('%w')
loc_dayyear = ephem.localtime(eos_time).strftime('%j')
loc_weekyear = ephem.localtime(eos_time).strftime('%W')
loc_lapd = ephem.localtime(eos_time).strftime('%x')
loc_lapt = ephem.localtime(eos_time).strftime('%X')

print loc_hour
print loc_minute
print loc_second
print loc_month
print loc_day
print loc_year
print loc_weekday
print loc_dayyear
print loc_weekyear
print loc_lapd
print loc_lapt

file_loc_hour = open('ramdisk/sunrise/loc_hour.txt', 'w')
file_loc_hour.write((loc_hour))
file_loc_hour.close()

file_loc_minute = open('ramdisk/sunrise/loc_minute.txt', 'w')
file_loc_minute.write((loc_minute))
file_loc_minute.close()

file_loc_second = open('ramdisk/sunrise/loc_second.txt', 'w')
file_loc_second.write((loc_second))
file_loc_second.close()

file_loc_month = open('ramdisk/sunrise/loc_month.txt', 'w')
file_loc_month.write((loc_month))
file_loc_month.close()

file_loc_day = open('ramdisk/sunrise/loc_day.txt', 'w')
file_loc_day.write((loc_day))
file_loc_day.close()

file_loc_year = open('ramdisk/sunrise/loc_year.txt', 'w')
file_loc_year.write((loc_year))
file_loc_year.close()

file_loc_weekday = open('ramdisk/sunrise/loc_weekday.txt', 'w')
file_loc_weekday.write((loc_weekday))
file_loc_weekday.close()

file_loc_dayyear = open('ramdisk/sunrise/loc_dayyear.txt', 'w')
file_loc_dayyear.write((loc_dayyear))
file_loc_dayyear.close()

file_loc_weekyear = open('ramdisk/sunrise/loc_weekyear.txt', 'w')
file_loc_weekyear.write((loc_weekyear))
file_loc_weekyear.close()

file_loc_lapd = open('ramdisk/sunrise/loc_lapd.txt', 'w')
file_loc_lapd.write((loc_lapd))
file_loc_lapd.close()

file_loc_lapt = open('ramdisk/sunrise/loc_lapt.txt', 'w')
file_loc_lapt.write((loc_lapt))
file_loc_lapt.close()
