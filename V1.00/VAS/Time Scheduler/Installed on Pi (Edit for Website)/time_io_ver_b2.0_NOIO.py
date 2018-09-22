#!/usr/bin/env python
# time_io_ver_b2(NO IO).py
# Program calculates sunrise and sunset each day and turns the correct UVA lamps on or off.
# Program calculates Civil Twilight each day and turns the correct UVB lamps on or off.
# Program calculates Sun Transit each day.
# Program calculates Moonrise and Moonset each day.
# Program calculates Moon Transit each day.
# Modules to import:
import datetime
import time
import ephem # to install, type$ pip install pyephem
# Start of Continuous Loop:
while True:
# Keep Screen Clean durring loop. (Windows Only)
    import os
    os.system('cls')
# Calculate what time it is now:
    now = datetime.datetime.now()
    now_hours = time.localtime(time.time())[3]
    now_minutes = time.localtime(time.time())[4]
    now_time = datetime.datetime.now().strftime('%H:%M')
# Current location:
    #Country = Some Country
    #City = Some City
    #State = Some State
    #Zip Code = Some Zip Code
    LAT = '00.000000'
    LOG = '-00.000000'
    Time_Zone = -5                      # Enter your Current Time Zone Here.
    TZ_DST_OBSERVED = False              # Is DST Observed in your Time Zone? (True or False)
    DST_ACTIVE_OFFSET = 0             # Enter your offset when DST season is active. (Should be 1 hour less than Time_Zone)
    DST_INACTIVE_OFFSET = 0       # Enter your offset when DST season is not active. (Should be same as Time_Zone)
    DST_OFFSET = 0
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
# Test times
    print ''
    print ''
    print 'Start of Loop'
    print ''
    print 'Times Test'
    print ''
    print "Current time"
    print now_time
    print ''
    print 'Civil Twilight Time Start'
    print sctl_time
    print ''
    print 'Sun Rise Time'
    print sr_time
    print ''
    print 'Sun Transit Time'
    print st_time
    print ''
    print 'Sun Set Time'
    print ss_time
    print ''
    print 'Civil Twilight Time End'
    print sctle_time
    print ''
    print 'Moon Rise Time'
    print mr_time
    print ''
    print 'Moon Transit Time'
    print mt_time
    print ''
    print 'Moon Set Time'
    print ms_time
# Raspberry Pi2 Simulated GPIO Control:
    print ''
    # Civil Twilight Begin to End: 
    if now_time >= sctl_time and now_time <= sctle_time:
        print "Civil Twilight Begin: Sun is, equal to or more than -6.0 degrees, above horrizon. It is now daylight outside"
    elif now_time <= sctl_time or now_time >= sctle_time:
        print "Civil Twilight End: Sun is, equal to or less than -6.0 degrees, below horrizon. It is now dark outside"
    print ''                    
    # Sunrise to Sunset: 
    if now_time >= sr_time and now_time <= ss_time:
        print "Sunrise: Sun is, equal to or more than -0.34 degrees, above horrizon. It is now daylight outside"
    elif now_time <= sr_time or now_time >= ss_time:
        print "Sunset: Sun is, equal to or less than -0.34 degrees, below horrizon. It is now dark outside"
    print ''			
    # Sun transiting Phase +/- 00:15 Minutes:
    if now_time >= st_time and now_time <= st_time:
        print "The Sun is now in Transiting position. 12ish'O Clock Position" 
    elif now_time <= st_time or now_time >= st_time:
        print "The Sun is not in Transiting position. Before or After 12'O Clock Position"
    print ''
    # Moon-Rise to Moon-Set:                     
    if now_time >= mr_time and now_time <= ms_time:
        print "Moon Rise: Moon is, equal to or more than -0.34 degrees, above horrizon."
    elif now_time <= mr_time or now_time >= ms_time:
        print "Moon Set: Moon is, equal to or less than -0.34 degrees, below horrizon"
    # Continuous Loop Repeat Time:
    time.sleep(30)
    # Loop running in Windows 10 Backgroud:
    # Every 30 Secounds = < ?% CPU;
    # For remainder of 29 Secounds = <= ?0% CPU;
    # Memory = ?
