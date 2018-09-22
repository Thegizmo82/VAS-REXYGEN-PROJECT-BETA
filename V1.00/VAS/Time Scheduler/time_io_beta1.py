#!/usr/bin/env python
# time_io_beta1.py
# Program calculates sunrise and sunset each day and turns the correct UBA lamps on or off.
# Program calculates Civil Twilight each day and turns the correct UBB lamps on or off.
# Program calculates Sun Transit each day.
# Program calculates Moonrise and Moonset each day.
# Program calculates Moon Transit each day.

# Modules to import:
import time
import datetime
import ephem
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
    now_time = datetime.time (now_hours, now_minutes)

# Current location:
    #Country = USA
    #City = Brunswick
    #State = GA
    #Zip Code = 31525
    LAT = '31.166667'
    LOG = '-81.483333'

# Start of Civil Twilight Observer Settings:
    sctl=ephem.Observer()
    sctl.pressure = 0
    sctl.horizon = '-6'
    sctl.lat= LAT
    sctl.lon= LOG
    sctl.date = now

# Start of Sunrise Observer Settings:
    sr=ephem.Observer()
    sr.pressure = 0
    sr.horizon = '-0:34'
    sr.lat= LAT
    sr.lon= LOG
    sr.date = now

# Transition of Sun Transit Observer Settings:
    st=ephem.Observer()
    st.pressure = 0
    st.horizon = '-0:34'
    st.lat= LAT
    st.lon= LOG
    st.date = now

# End of Sunset Observer Settings:
    ss=ephem.Observer()
    ss.pressure = 0
    ss.horizon = '-0:34'
    ss.lat= LAT
    ss.lon= LOG
    ss.date = now

# End of Civil Twilight Observer Settings:
    sctle=ephem.Observer()
    sctle.pressure = 0
    sctle.horizon = '-6'
    sctle.lat= LAT
    sctle.lon= LOG
    sctle.date = now

# Start of Moon Rising Observer Settings:
    mr=ephem.Observer()
    mr.pressure = 0
    mr.horizon = '-0:34'
    mr.lat= LAT
    mr.lon= LOG
    mr.date = now
    
# Transition of Moon Transit Observer Settings:
    mt=ephem.Observer()
    mt.pressure = 0
    mt.horizon = '-0:34'
    mt.lat= LAT
    mt.lon= LOG
    mt.date = now

# End of Moon Setting Observer Settings:
    ms=ephem.Observer()
    ms.pressure = 0
    ms.horizon = '-0:34'
    ms.lat= LAT
    ms.lon= LOG
    ms.date = now

# Sun or Moon PyEphem Selection: 
    sun = ephem.Sun()
    moon = ephem.Moon()


# Start of Civil Twilight Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Civil Twilight Starts:
    sctl_hours = sctl.next_rising(sun, use_center=True).tuple()[3]
# sctl_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        sctl_hours = sctl_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        sctl_hours = sctl_hours - 5
        sctl_minutes = sctl.next_rising(sun, use_center=True).tuple()[4]
        sctl_time = datetime.time(sctl_hours, sctl_minutes)

# Start of Sunrise Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Sunrise Starts:
    sunrise_hours = sr.next_rising(sun, use_center=True).tuple()[3]
#sunrise_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        sunrise_hours = sunrise_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        sunrise_hours = sunrise_hours - 5
        sunrise_minutes = sr.next_rising(sun, use_center=True).tuple()[4]
        sunrise_time = datetime.time(sunrise_hours, sunrise_minutes)

# Transition of Sun Transit Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Transition of Sun Starts:
    suntransit_hours = st.next_transit(sun).tuple()[3]
#suntransit_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        suntransit_hours = suntransit_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        suntransit_hours = suntransit_hours - 5
        suntransit_minutes = st.next_transit(sun).tuple()[4]
        suntransit_time = datetime.time(suntransit_hours, suntransit_minutes)
        stob_time = datetime.time(suntransit_hours +0, suntransit_minutes +30)

# End of Sunset Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Sunset Ends:
    sunset_hours = ss.next_setting(sun, use_center=True).tuple()[3]
#sunset_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        sunset_hours = sunset_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        sunset_hours = sunset_hours - 5
        sunset_minutes = ss.next_setting(sun, use_center=True).tuple()[4]
        sunset_time = datetime.time(sunset_hours, sunset_minutes)

# End of Civil Twilight Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Civil Twilight Ends:
    sctle_hours = sctle.next_setting(sun, use_center=True).tuple()[3]
#sctle_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        sctle_hours = sctle_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        sctle_hours = sctle_hours - 5
        sctle_minutes = sctle.next_setting(sun, use_center=True).tuple()[4]
        sctle_time = datetime.time(sctle_hours, sctle_minutes)

# Start of Moon Rising Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Moon Rise Starts:
    mr_hours = mr.next_rising(moon, use_center=True).tuple()[3]
#mr_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        mr_hours = mr_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        mr_hours = mr_hours - 5
        mr_minutes = mr.next_rising(moon, use_center=True).tuple()[4]
        mr_time = datetime.time(mr_hours, mr_minutes)

# Transition of Moon Transit Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Moon Transition Starts:
    mt_hours = mt.next_transit(moon).tuple()[3]
#mt_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        mt_hours = mt_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        mt_hours = mt_hours - 5
        mt_minutes = mt.next_transit(moon).tuple()[4]
        mt_time = datetime.time(mt_hours, mt_minutes)

# End of Moon Setting Observer:
# Calculate if it is daylight savings time or not,
# isdst will be 1 if DST is currently enforced, 0 otherwise.
    isdst = time.localtime().tm_isdst
# Calculate when Moon Setting Ends:
    ms_hours = ms.next_setting(moon, use_center=True).tuple()[3]
#ms_hours will be in 24-hour GMT.
    if isdst == 1: #Add your timezone offset when DST is observed,(-4), to the time:
        ms_hours = ms_hours - 4
    else: #Add your timezone offset when DST is not observed,(-5), to the time:
        ms_hours = ms_hours - 5
        ms_minutes = ms.next_setting(moon, use_center=True).tuple()[4]
        ms_time = datetime.time(ms_hours, ms_minutes)

# Raspberry Pi2 GPIO Control:

    # Civil Twilight Begin to End:
    if now_time >= sctl_time and now_time <= sctle_time:
        GPIO.output(15,False)
    elif now_time <= sctl_time or now_time >= sctle_time:
        GPIO.output(15,True)

    # Sunrise to Sunset:    
    if now_time >= sunrise_time and now_time <= sunset_time:
        GPIO.output(11,False)
        GPIO.output(13,False)
    elif now_time <= sunrise_time or now_time >= sunset_time:
        GPIO.output(11,True)
        GPIO.output(13,True)

    # Suntraniting Phase +/- 00:15 Minutes:			
    #if now_time >= suntransit_time and now_time <= stob_time:
        #GPIO.output(xx,False)
    #elif now_time <= suntransit_time or now_time >= stob_time:
        #GPIO.output(xx,True)

    # Moon-Rise to Moon-Set:                    
    #if now_time >= mr_time and now_time <= ms_time:
        #GPIO.output(xx,False)
    #elif now_time <= mr_time or now_time >= ms_time:
        #GPIO.output(xx,True) 
                        

    # Continuous Loop:
    time.sleep(30)
    # Loop running in Raspberry Pi2:
    # Every 30 Secounds = < ?% CPU;
    # For remainder of 29 Secounds = <= ?% CPU;
    # Memory = ?MB
