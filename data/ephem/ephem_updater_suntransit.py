#!/usr/bin/env python
# ephem_updater_suntransit.py
# Modules to import:
import datetime
import time
import ephem
import socket
import struct
import os

# CREATE RAM-DISK SUB-DIRECTORY IF DOES NOT EXIST
try:
    os.makedirs ('/rex/data/ramdisk/sun_transit')
except OSError:
    if not os.path.isdir ('/rex/data/ramdisk/sun_transit'):
        raise

# Calculate what time it is now:
nowtd = datetime.datetime.now()
nowtd_hours = time.localtime(time.time())[3]
nowtd_minutes = time.localtime(time.time())[4]
nowtd_time = datetime.datetime.now().strftime('%H:%M')
nowtd_time_h = datetime.datetime.now().strftime('%H')
nowtd_time_m = datetime.datetime.now().strftime('%M')
nowtd_time_s = datetime.datetime.now().strftime('%S')

# READ LATITIDE FILE FROM REX CORE 
file_LAT = open('/rex/data/static/LAT.txt', 'r')
LAT = file_LAT.read()
file_LAT.close()

# READ LONGITUDE FILE FROM REX CORE
file_LON = open('/rex/data/static/LON.txt', 'r')
LON = file_LON.read()
file_LON.close()

# OBSERVER SETTINGS:
eos=ephem.Observer()
eos.pressure = 0
eos.horizon = '-0:34'
eos_is_rise = False
eos_is_sun = True
eos.lat = LAT
eos.lon = LON
eos.date = datetime.date.today()
eos_next_event = eos.previous_transit if eos_is_rise else eos.next_transit
eos_sun_moon = ephem.Sun() if eos_is_sun else ephem.Moon()

# SUN OR MOON PyEphem SELECTION: 
sun = ephem.Sun()
moon = ephem.Moon()

# OBSERVER:
eos_time = (eos_next_event(eos_sun_moon))

# UTC STRUCTURED DATE & TIME
utc_hour = ephem.date.datetime(eos_time).strftime('%H')
utc_minute = ephem.date.datetime(eos_time).strftime('%M')
utc_second = ephem.date.datetime(eos_time).strftime('%S')
utc_month = ephem.date.datetime(eos_time).strftime('%m')
utc_day = ephem.date.datetime(eos_time).strftime('%d')
utc_year = ephem.date.datetime(eos_time).strftime('%Y')
utc_weekday = ephem.date.datetime(eos_time).strftime('%w')
utc_dayyear = ephem.date.datetime(eos_time).strftime('%j')
utc_weekyear = ephem.date.datetime(eos_time).strftime('%W')
utc_lapd = ephem.date.datetime(eos_time).strftime('%x')
utc_lapt = ephem.date.datetime(eos_time).strftime('%X')

# LOCAL STRUCTURED DATE & TIME
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

# WRITE FILE UTC HOUR
file_utc_hour = open('/rex/data/ramdisk/sun_transit/utc_hour.txt', 'w')
file_utc_hour.write((loc_hour))
file_utc_hour.close()

# WRITE FILE UTC MINUTE
file_utc_minute = open('/rex/data/ramdisk/sun_transit/utc_minute.txt', 'w')
file_utc_minute.write((loc_minute))
file_utc_minute.close()

# WRITE FILE UTC SECOND
file_utc_second = open('/rex/data/ramdisk/sun_transit/utc_second.txt', 'w')
file_utc_second.write((loc_second))
file_utc_second.close()

# WRITE FILE UTC MONTH
file_utc_month = open('/rex/data/ramdisk/sun_transit/utc_month.txt', 'w')
file_utc_month.write((loc_month))
file_utc_month.close()

# WRITE FILE UTC DAY
file_utc_day = open('/rex/data/ramdisk/sun_transit/utc_day.txt', 'w')
file_utc_day.write((loc_day))
file_utc_day.close()

# WRITE FILE UTC YEAR
file_utc_year = open('/rex/data/ramdisk/sun_transit/utc_year.txt', 'w')
file_utc_year.write((loc_year))
file_utc_year.close()

# WRITE FILE UTC WEEKDAY
file_utc_weekday = open('/rex/data/ramdisk/sun_transit/utc_weekday.txt', 'w')
file_utc_weekday.write((loc_weekday))
file_utc_weekday.close()

# WRITE FILE UTC DAY OF YEAR
file_utc_dayyear = open('/rex/data/ramdisk/sun_transit/utc_dayyear.txt', 'w')
file_utc_dayyear.write((loc_dayyear))
file_utc_dayyear.close()

# WRITE FILE UTC WEEK OF YEAR
file_utc_weekyear = open('/rex/data/ramdisk/sun_transit/utc_weekyear.txt', 'w')
file_utc_weekyear.write((loc_weekyear))
file_utc_weekyear.close()

# WRITE FILE UTC, LOCALE'S APPROPRIATE DATE REPRESENTATION
file_utc_lapd = open('/rex/data/ramdisk/sun_transit/utc_lapd.txt', 'w')
file_utc_lapd.write((loc_lapd))
file_utc_lapd.close()

# WRITE FILE UTC, LOCALE'S APPROPRIATE TIME REPRESENTATION
file_utc_lapt = open('/rex/data/ramdisk/sun_transit/utc_lapt.txt', 'w')
file_utc_lapt.write((loc_lapt))
file_utc_lapt.close()

# WRITE FILE LOCAL HOUR
file_loc_hour = open('/rex/data/ramdisk/sun_transit/loc_hour.txt', 'w')
file_loc_hour.write((loc_hour))
file_loc_hour.close()

# WRITE FILE LOCAL MINUTE
file_loc_minute = open('/rex/data/ramdisk/sun_transit/loc_minute.txt', 'w')
file_loc_minute.write((loc_minute))
file_loc_minute.close()

# WRITE FILE LOCAL SECOND
file_loc_second = open('/rex/data/ramdisk/sun_transit/loc_second.txt', 'w')
file_loc_second.write((loc_second))
file_loc_second.close()

# WRITE FILE LOCAL MONTH
file_loc_month = open('/rex/data/ramdisk/sun_transit/loc_month.txt', 'w')
file_loc_month.write((loc_month))
file_loc_month.close()

# WRITE FILE LOCAL DAY
file_loc_day = open('/rex/data/ramdisk/sun_transit/loc_day.txt', 'w')
file_loc_day.write((loc_day))
file_loc_day.close()

# WRITE FILE LOCAL YEAR
file_loc_year = open('/rex/data/ramdisk/sun_transit/loc_year.txt', 'w')
file_loc_year.write((loc_year))
file_loc_year.close()

# WRITE FILE LOCAL WEEKDAY
file_loc_weekday = open('/rex/data/ramdisk/sun_transit/loc_weekday.txt', 'w')
file_loc_weekday.write((loc_weekday))
file_loc_weekday.close()

# WRITE FILE LOCAL DAY OF YEAR
file_loc_dayyear = open('/rex/data/ramdisk/sun_transit/loc_dayyear.txt', 'w')
file_loc_dayyear.write((loc_dayyear))
file_loc_dayyear.close()

# WRITE FILE LOCAL WEEK OF YEAR
file_loc_weekyear = open('/rex/data/ramdisk/sun_transit/loc_weekyear.txt', 'w')
file_loc_weekyear.write((loc_weekyear))
file_loc_weekyear.close()

# WRITE FILE LOCAL, LOCALE'S APPROPRIATE DATE REPRESENTATION
file_loc_lapd = open('/rex/data/ramdisk/sun_transit/loc_lapd.txt', 'w')
file_loc_lapd.write((loc_lapd))
file_loc_lapd.close()

# WRITE FILE LOCAL, LOCALE'S APPROPRIATE TIME REPRESENTATION
file_loc_lapt = open('/rex/data/ramdisk/sun_transit/loc_lapt.txt', 'w')
file_loc_lapt.write((loc_lapt))
file_loc_lapt.close()
