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


# Keep Screen Clean durring loop. (Windows Only)
#    import os
#    os.system('clear')
    
# Calculate what time it is now:
now = datetime.datetime.now()
now_hours = time.localtime(time.time())[3]
now_minutes = time.localtime(time.time())[4]
now_time = datetime.datetime.now().strftime('%H:%M')
now_time_h = datetime.datetime.now().strftime('%H')
now_time_m = datetime.datetime.now().strftime('%M')
now_time_s = datetime.datetime.now().strftime('%S')

#LAT_A = '31.1666667'
file_LAT = open('/rex/data/static/LAT.txt', 'r')
LAT = file_LAT.read()
file_LAT.close()
#print LAT

file_LON = open('/rex/data/static/LON.txt', 'r')
LON = file_LON.read()
file_LON.close()
#print LON


#    file_LAT2 = open('/rex/data/static/LAT1.txt', 'w')
#    file_LAT2.write((LAT1))
#    file_LAT3 = open('/rex/data/static/LAT1.txt', 'r')
#    LAT = file_LAT3.read()
# Current location:
    #Country = USA
    #City = Brunswick
    #State = GA
    #Zip Code = 31525
#LAT = '31.166667'
#LON = '-81.483333'
Time_Zone = -5                      # Enter your Current Time Zone Here.
TZ_DST_OBSERVED = True              # Is DST Observed in your Time Zone? (True or False)
DST_ACTIVE_OFFSET = -4              # Enter your offset when DST season is active. (Should be 1 hour less than Time_Zone)
DST_INACTIVE_OFFSET = -5       # Enter your offset when DST season is not active. (Should be same as Time_Zone)
DST_OFFSET = -5

# Start of Civil Twilight Observer Settings:
sctl=ephem.Observer()
sctl.pressure = 0
sctl.horizon = '-6'
sctl_is_rise = True
sctl.lat = LAT
sctl.lon = LON
sctl.date = datetime.date.today()
sctl_next_event = sctl.next_rising if sctl_is_rise else sctl.next_setting

# Start of Sunrise Observer Settings:
sr=ephem.Observer()
sr.pressure = 0
sr.horizon = '-0:34'
sr_is_rise = True
sr.lat= LAT
sr.lon= LON
sr.date = datetime.date.today()
sr_next_event = sr.next_rising if sr_is_rise else sr.next_setting

# Transition of Sun Transit Observer Settings:
st=ephem.Observer()
st.pressure = 0
st.horizon = '-0:34'
st_is_rise = False
st.lat= LAT
st.lon= LON
st.date = datetime.date.today()
st_next_event = st.previous_transit if st_is_rise else st.next_transit

# End of Sunset Observer Settings:
ss=ephem.Observer()
ss.pressure = 0
ss.horizon = '-0:34'
ss_is_rise = False
ss.lat= LAT
ss.lon= LON
ss.date = datetime.date.today()
ss_next_event = ss.next_rising if ss_is_rise else ss.next_setting

# End of Civil Twilight Observer Settings:
sctle=ephem.Observer()
sctle.pressure = 0
sctle.horizon = '-6'
sctle_is_rise = False
sctle.lat= LAT
sctle.lon= LON
sctle.date = datetime.date.today()
sctle_next_event = sctle.next_rising if sctle_is_rise else sctle.next_setting

# Start of Moon Rising Observer Settings:
mr=ephem.Observer()
mr.pressure = 0
mr.horizon = '-0:34'
mr_is_rise = True
mr.lat= LAT
mr.lon= LON
mr.date = datetime.date.today()
mr_next_event = mr.next_rising if mr_is_rise else mr.next_setting
    
# Transition of Moon Transit Observer Settings:
mt=ephem.Observer()
mt.pressure = 0
mt.horizon = '-0:34'
mt_is_rise = False
mt.lat= LAT
mt.lon= LON
mt.date = datetime.date.today()
mt_next_event = mt.previous_transit if mt_is_rise else mt.next_transit

# End of Moon Setting Observer Settings:
ms=ephem.Observer()
ms.pressure = 0
ms.horizon = '-0:34'
ms_is_rise = False
ms.lat= LAT
ms.lon= LON
ms.date = datetime.date.today()
ms_next_event = ms.next_rising if ms_is_rise else ms.next_setting

# Sun or Moon PyEphem Selection: 
sun = ephem.Sun()
moon = ephem.Moon()

# Start of Civil Twilight Observer:
#    sctl_time = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# Start of Civil Twilight Observer:
sctl_time_h = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# Start of Civil Twilight Observer:
sctl_time_m = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# Start of Civil Twilight Observer:
sctl_time_s = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')
    
# Start of Sunrise Observer:
#    sr_time = ephem.Date(sr_next_event(sun, use_center=True, start=sr.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# Start of Sunrise Observer:
sr_time_h = ephem.Date(sr_next_event(sun, use_center=True, start=sr.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# Start of Sunrise Observer:
sr_time_m = ephem.Date(sr_next_event(sun, use_center=True, start=sr.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# Start of Sunrise Observer:
sr_time_s = ephem.Date(sr_next_event(sun, use_center=True, start=sr.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')

# Transition of Sun Transit Observer:
#    st_time = ephem.Date(st_next_event(sun, start=st.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# Transition of Sun Transit Observer:
st_time_h = ephem.Date(st_next_event(sun, start=st.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# Transition of Sun Transit Observer:
st_time_m = ephem.Date(st_next_event(sun, start=st.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# Transition of Sun Transit Observer:
st_time_s = ephem.Date(st_next_event(sun, start=st.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')

# End of Sunset Observer:
#    ss_time = ephem.Date(ss_next_event(sun, use_center=True, start=ss.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# End of Sunset Observer:
ss_time_h = ephem.Date(ss_next_event(sun, use_center=True, start=ss.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# End of Sunset Observer:
ss_time_m = ephem.Date(ss_next_event(sun, use_center=True, start=ss.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# End of Sunset Observer:
ss_time_s = ephem.Date(ss_next_event(sun, use_center=True, start=ss.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')

# End of Civil Twilight Observer:
#    sctle_time = ephem.Date(sctle_next_event(sun, use_center=True, start=sctle.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# End of Civil Twilight Observer:
sctle_time_h = ephem.Date(sctle_next_event(sun, use_center=True, start=sctle.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# End of Civil Twilight Observer:
sctle_time_m = ephem.Date(sctle_next_event(sun, use_center=True, start=sctle.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# End of Civil Twilight Observer:
sctle_time_s = ephem.Date(sctle_next_event(sun, use_center=True, start=sctle.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')

# Start of Moon Rising Observer:
#    mr_time = ephem.Date(mr_next_event(moon, use_center=False, start=mr.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# Start of Moon Rising Observer:
mr_time_h = ephem.Date(mr_next_event(moon, use_center=False, start=mr.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# Start of Moon Rising Observer:
mr_time_m = ephem.Date(mr_next_event(moon, use_center=False, start=mr.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# Start of Moon Rising Observer:
mr_time_s = ephem.Date(mr_next_event(moon, use_center=False, start=mr.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')

# Transition of Moon Transit Observer:
#    mt_time = ephem.Date(mt_next_event(moon, start=mt.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# Transition of Moon Transit Observer:
mt_time_h = ephem.Date(mt_next_event(moon, start=mt.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# Transition of Moon Transit Observer:
mt_time_m = ephem.Date(mt_next_event(moon, start=mt.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# Transition of Moon Transit Observer:
mt_time_s = ephem.Date(mt_next_event(moon, start=mt.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')

# End of Moon Setting Observer:
#    ms_time = ephem.Date(ms_next_event(moon, use_center=False, start=ms.date) + DST_OFFSET *ephem.hour
#                           ).datetime().strftime('%H:%M')

# End of Moon Setting Observer:
ms_time_h = ephem.Date(ms_next_event(moon, use_center=False, start=ms.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%H')

# End of Moon Setting Observer:
ms_time_m = ephem.Date(ms_next_event(moon, use_center=False, start=ms.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%M')

# End of Moon Setting Observer:
ms_time_s = ephem.Date(ms_next_event(moon, use_center=False, start=ms.date) + DST_OFFSET *ephem.hour
                       ).datetime().strftime('%S')

#    now_time_fh = open('/rex/data/ramdisk/now_time_h.txt', 'w')
#    now_time_fh.write((now_time_h))

#    now_time_fm = open('/rex/data/ramdisk/now_time_m.txt', 'w')
#    now_time_fm.write((now_time_m))

#    now_time_fs = open('/rex/data/ramdisk/now_time_s.txt', 'w')
#    now_time_fs.write((now_time_s))

sctl_time_fh = open('/rex/data/ramdisk/sctl_time_h.txt', 'w')
sctl_time_fh.write((sctl_time_h))

sctl_time_fm = open('/rex/data/ramdisk/sctl_time_m.txt', 'w')
sctl_time_fm.write((sctl_time_m))

sctl_time_fs = open('/rex/data/ramdisk/sctl_time_s.txt', 'w')
sctl_time_fs.write((sctl_time_s))
   
sr_time_fh = open('/rex/data/ramdisk/sr_time_h.txt', 'w')
sr_time_fh.write((sr_time_h))

sr_time_fm = open('/rex/data/ramdisk/sr_time_m.txt', 'w')
sr_time_fm.write((sr_time_m))

sr_time_fs = open('/rex/data/ramdisk/sr_time_s.txt', 'w')
sr_time_fs.write((sr_time_s))
    
st_time_fh = open('/rex/data/ramdisk/st_time_h.txt', 'w')
st_time_fh.write((st_time_h))

st_time_fm = open('/rex/data/ramdisk/st_time_m.txt', 'w')
st_time_fm.write((st_time_m))

st_time_fs = open('/rex/data/ramdisk/st_time_s.txt', 'w')
st_time_fs.write((st_time_s))
    
ss_time_fh = open('/rex/data/ramdisk/ss_time_h.txt', 'w')
ss_time_fh.write((ss_time_h))

ss_time_fm = open('/rex/data/ramdisk/ss_time_m.txt', 'w')
ss_time_fm.write((ss_time_m))

ss_time_fs = open('/rex/data/ramdisk/ss_time_s.txt', 'w')
ss_time_fs.write((ss_time_s))
    
sctle_time_fh = open('/rex/data/ramdisk/sctle_time_h.txt', 'w')
sctle_time_fh.write((sctle_time_h))

sctle_time_fm = open('/rex/data/ramdisk/sctle_time_m.txt', 'w')
sctle_time_fm.write((sctle_time_m))

sctle_time_fs = open('/rex/data/ramdisk/sctle_time_s.txt', 'w')
sctle_time_fs.write((sctle_time_s))
    
mr_time_fh = open('/rex/data/ramdisk/mr_time_h.txt', 'w')
mr_time_fh.write((mr_time_h))

mr_time_fm = open('/rex/data/ramdisk/mr_time_m.txt', 'w')
mr_time_fm.write((mr_time_m))

mr_time_fs = open('/rex/data/ramdisk/mr_time_s.txt', 'w')
mr_time_fs.write((mr_time_s))

mt_time_fh = open('/rex/data/ramdisk/mt_time_h.txt', 'w')
mt_time_fh.write((mt_time_h))

mt_time_fm = open('/rex/data/ramdisk/mt_time_m.txt', 'w')
mt_time_fm.write((mt_time_m))

mt_time_fs = open('/rex/data/ramdisk/mt_time_s.txt', 'w')
mt_time_fs.write((mt_time_s))
    
ms_time_fh = open('/rex/data/ramdisk/ms_time_h.txt', 'w')
ms_time_fh.write((ms_time_h))

ms_time_fm = open('/rex/data/ramdisk/ms_time_m.txt', 'w')
ms_time_fm.write((ms_time_m))

ms_time_fs = open('/rex/data/ramdisk/ms_time_s.txt', 'w')
ms_time_fs.write((ms_time_s))
    
#time.sleep(10)
