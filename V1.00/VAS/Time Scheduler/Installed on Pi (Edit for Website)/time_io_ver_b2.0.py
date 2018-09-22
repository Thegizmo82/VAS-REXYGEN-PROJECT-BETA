#!/usr/bin/python
# time_io_ver_b2.0.py
# Program calculates sunrise and sunset each day and turns the correct UBA lamps on or off.
# Program calculates Civil Twilight each day and turns the correct UBB lamps on or off.
# Program calculates Sun Transit each day.
# Program calculates Moonrise and Moonset each day.
# Program calculates Moon Transit each day.

import datetime
import time
import ephem # to install, type$ pip install pyephem
import RPi.GPIO as GPIO

# Raspberry Pi 2 GPIO Settings:
GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(11, GPIO.OUT)
GPIO.setup(13, GPIO.OUT)
GPIO.setup(15, GPIO.OUT)
GPIO.setup(16, GPIO.OUT)

# Start of Continuous Loop:
while True:
    
# Calculate what time it is now:
    now = datetime.datetime.now()
    now_hours = time.localtime(time.time())[3]
    now_minutes = time.localtime(time.time())[4]
    now_time = datetime.datetime.now().strftime('%H:%M')
    
# Current location:
    #Country = USA
    #City = Brunswick
    #State = GA
    #Zip Code = 31525
    LAT = '31.166667'
    LOG = '-81.483333'
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
    sctl.lon = LOG
    sctl.date = datetime.date.today()
    sctl_next_event = sctl.next_rising if sctl_is_rise else sctl.next_setting

# Start of Sunrise Observer Settings:
    sr=ephem.Observer()
    sr.pressure = 0
    sr.horizon = '-0:34'
    sr_is_rise = True
    sr.lat= LAT
    sr.lon= LOG
    sr.date = datetime.date.today()
    sr_next_event = sr.next_rising if sr_is_rise else sr.next_setting

# Transition of Sun Transit Observer Settings:
    st=ephem.Observer()
    st.pressure = 0
    st.horizon = '-0:34'
    st_is_rise = False
    st.lat= LAT
    st.lon= LOG
    st.date = datetime.date.today()
    st_next_event = st.previous_transit if st_is_rise else st.next_transit

# End of Sunset Observer Settings:
    ss=ephem.Observer()
    ss.pressure = 0
    ss.horizon = '-0:34'
    ss_is_rise = False
    ss.lat= LAT
    ss.lon= LOG
    ss.date = datetime.date.today()
    ss_next_event = ss.next_rising if ss_is_rise else ss.next_setting

# End of Civil Twilight Observer Settings:
    sctle=ephem.Observer()
    sctle.pressure = 0
    sctle.horizon = '-6'
    sctle_is_rise = False
    sctle.lat= LAT
    sctle.lon= LOG
    sctle.date = datetime.date.today()
    sctle_next_event = sctle.next_rising if sctle_is_rise else sctle.next_setting

# Start of Moon Rising Observer Settings:
    mr=ephem.Observer()
    mr.pressure = 0
    mr.horizon = '-0:34'
    mr_is_rise = True
    mr.lat= LAT
    mr.lon= LOG
    mr.date = datetime.date.today()
    mr_next_event = mr.next_rising if mr_is_rise else mr.next_setting
    
# Transition of Moon Transit Observer Settings:
    mt=ephem.Observer()
    mt.pressure = 0
    mt.horizon = '-0:34'
    mt_is_rise = False
    mt.lat= LAT
    mt.lon= LOG
    mt.date = datetime.date.today()
    mt_next_event = mt.previous_transit if mt_is_rise else mt.next_transit

# End of Moon Setting Observer Settings:
    ms=ephem.Observer()
    ms.pressure = 0
    ms.horizon = '-0:34'
    ms_is_rise = False
    ms.lat= LAT
    ms.lon= LOG
    ms.date = datetime.date.today()
    ms_next_event = ms.next_rising if ms_is_rise else ms.next_setting

# Sun or Moon PyEphem Selection: 
    sun = ephem.Sun()
    moon = ephem.Moon()

# Start of Civil Twilight Observer:
    sctl_time = ephem.Date(sctl_next_event(sun, use_center=True, start=sctl.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')

# Start of Sunrise Observer:
    sr_time = ephem.Date(sr_next_event(sun, use_center=True, start=sr.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')

# Transition of Sun Transit Observer:
    st_time = ephem.Date(st_next_event(sun, start=st.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')

# End of Sunset Observer:
    ss_time = ephem.Date(ss_next_event(sun, use_center=True, start=ss.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')

# End of Civil Twilight Observer:
    sctle_time = ephem.Date(sctle_next_event(sun, use_center=True, start=sctle.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')

# Start of Moon Rising Observer:
    mr_time = ephem.Date(mr_next_event(moon, use_center=False, start=mr.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')

# Transition of Moon Transit Observer:
    mt_time = ephem.Date(mt_next_event(moon, start=mt.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')

# End of Moon Setting Observer:
    ms_time = ephem.Date(ms_next_event(moon, use_center=False, start=ms.date) + DST_OFFSET *ephem.hour
                           ).datetime().strftime('%H:%M')


# Raspberry Pi2 Simulated GPIO Control:

        # Civil Twilight Begin to End: 
    if now_time >= sctl_time and now_time <= sctle_time:
        GPIO.output(15,False)
    elif now_time <= sctl_time or now_time >= sctle_time:
        GPIO.output(15,True)                     
    # Sunrise to Sunset: 
    if now_time >= sr_time and now_time <= ss_time:
        GPIO.output(11,False)
        GPIO.output(13,False)
	GPIO.output(16,True)  
    elif now_time <= sr_time or now_time >= ss_time:
        GPIO.output(11,True)
        GPIO.output(13,True)
        GPIO.output(16,False)
    # Sun transiting Phase +/- 00:15 Minutes:
    #if now_time >= st_time and now_time <= st_time:
        #GPIO.output(xx,False)
    #elif now_time <= st_time or now_time >= st_time:
        #GPIO.output(xx,True)

    # Moon-Rise to Moon-Set:                     
    #if now_time >= mr_time and now_time <= ms_time:
        #GPIO.output(xx,False)
    #elif now_time <= mr_time or now_time >= ms_time:
        #GPIO.output(xx,True) 

    
    # Continuous Loop Repeat Time:
    time.sleep(30)

    # Loop running in Raspberry Pi2 (Rasbian-Jessie) Backgroud:
    # Every 30 Secounds: <= 1% CPU;
    # For remainder of 29 Secounds: <= 0% CPU;
    # Memory: RSS = 3.1MB VM-Size = 6.4MB
