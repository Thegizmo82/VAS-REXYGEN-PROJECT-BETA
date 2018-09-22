        #!/usr/bin/env python
        # program calculates sunset each day and turns the lamp on 30 minutes before

        # then the program calculates a random minute to turn the lamp off within an hour after midnight.



        # REMEMBER TO USE 24-HOUR TIME FORMAT

        # AND THAT PYEPHEM USES UTC/GMT AND NOT EST

import time
import datetime
import ephem
import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BOARD)
GPIO.setwarnings(False)
GPIO.setup(11, GPIO.OUT)
GPIO.setup(13, GPIO.OUT)
GPIO.setup(15, GPIO.OUT)
GPIO.setup(16, GPIO.OUT)

while True:
        # figure out what time it is now
                now = datetime.datetime.now()
                now_hours = time.localtime(time.time())[3]
                now_minutes = time.localtime(time.time())[4]
                now_time = datetime.time (now_hours, now_minutes)
        # provide the program with information about the current location:
                LAT = '31.166667'
                LOG = '-81.483333'

        # Begin Civil Twilight Observer Settings
                sctl=ephem.Observer()
                sctl.pressure = 0
                sctl.horizon = '-6'
                sctl.lat= LAT
                sctl.lon= LOG
                sctl.date = now

        # Begin Sunrise Observer Settings
                sr=ephem.Observer()
                sr.pressure = 0
                sr.horizon = '-0:34'
                sr.lat= LAT
                sr.lon= LOG
                sr.date = now

        # Begin Sun Transit Observer Settings
                st=ephem.Observer()
                st.pressure = 0
                st.horizon = '-0:34'
                st.lat= LAT
                st.lon= LOG
                st.date = now

        # Begin Sunset
                ss=ephem.Observer()
                ss.pressure = 0
                ss.horizon = '-0:34'
                ss.lat= LAT
                ss.lon= LOG
                ss.date = now

        # End Civil Twilight Observer Settings
                sctle=ephem.Observer()
                sctle.pressure = 0
                sctle.horizon = '-6'
                sctle.lat= LAT
                sctle.lon= LOG
                sctle.date = now

        # Begin Moon rising Observer Settings
                mr=ephem.Observer()
                mr.pressure = 0
                mr.horizon = '-0:34'
                mr.lat= LAT
                mr.lon= LOG
                mr.date = now

        # Begin Moon Transit Observer Settings
                mt=ephem.Observer()
                mt.pressure = 0
                mt.horizon = '-0:34'
                mt.lat= LAT
                mt.lon= LOG
                mt.date = now

        # Begin Moon Setting Observer Settings
                ms=ephem.Observer()
                ms.pressure = 0
                ms.horizon = '-0:34'
                ms.lat= LAT
                ms.lon= LOG
                ms.date = now

                sun = ephem.Sun()
                moon = ephem.Moon()


        # Begin Civil Twilight
        # figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when Civil Twilight Starts:
                sctl_hours = sctl.next_rising(sun, use_center=True).tuple()[3]
        #sctl_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        sctl_hours = sctl_hours - 4
                else: #add 5 to the time for EST
                        sctl_hours = sctl_hours - 5
                        sctl_minutes = sctl.next_rising(sun, use_center=True).tuple()[4]
                        sctl_time = datetime.time(sctl_hours, sctl_minutes)

        # Begin Sunrise
        # figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when sunrise starts:
                sunrise_hours = sr.next_rising(sun, use_center=True).tuple()[3]
        #sunrise_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        sunrise_hours = sunrise_hours - 4
                else: #add 5 to the time for EST
                        sunrise_hours = sunrise_hours - 5
                        sunrise_minutes = sr.next_rising(sun, use_center=True).tuple()[4]
                        sunrise_time = datetime.time(sunrise_hours, sunrise_minutes)

        # Begin Sun Transit
        # Figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when sun transit starts:
                suntransit_hours = st.next_transit(sun).tuple()[3]
        #suntransit_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        suntransit_hours = suntransit_hours - 4
                else: #add 5 to the time for EST
                        suntransit_hours = suntransit_hours - 5
                        suntransit_minutes = st.next_transit(sun).tuple()[4]
                        suntransit_time = datetime.time(suntransit_hours, suntransit_minutes)
                        stob_time = datetime.time(suntransit_hours +0, suntransit_minutes +30)


        # Begin Sunsetting
        # figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when sun set starts:
                sunset_hours = ss.next_setting(sun, use_center=True).tuple()[3]
        #sunset_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        sunset_hours = sunset_hours - 4
                else: #add 5 to the time for EST
                        sunset_hours = sunset_hours - 5
                        sunset_minutes = ss.next_setting(sun, use_center=True).tuple()[4]
                        sunset_time = datetime.time(sunset_hours, sunset_minutes)

        # End Civil twilight
        # figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when civil twilight ends:
                sctle_hours = sctle.next_setting(sun, use_center=True).tuple()[3]
        #sctle_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        sctle_hours = sctle_hours - 4
                else: #add 5 to the time for EST
                        sctle_hours = sctle_hours - 5
                        sctle_minutes = sctle.next_setting(sun, use_center=True).tuple()[4]
                        sctle_time = datetime.time(sctle_hours, sctle_minutes)

        # Start Moonrise
        # figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when Moonrise Starts:
                mr_hours = mr.next_rising(moon, use_center=True).tuple()[3]
        #mr_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        mr_hours = mr_hours - 4
                else: #add 5 to the time for EST
                        mr_hours = mr_hours - 5
                        mr_minutes = mr.next_rising(moon, use_center=True).tuple()[4]
                        mr_time = datetime.time(mr_hours, mr_minutes)

        # Start Moon Transit
        # figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when moon transit starts:
                mt_hours = mt.next_transit(moon).tuple()[3]
        #mt_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        mt_hours = mt_hours - 4
                else: #add 5 to the time for EST
                        mt_hours = mt_hours - 5
                        mt_minutes = mt.next_transit(moon).tuple()[4]
                        mt_time = datetime.time(mt_hours, mt_minutes)

        # Start Moonset
        # figure out if it is daylight savings time or not:
        # isdst will be 1 if DST is currently enforced, 0 otherwise
                isdst = time.localtime().tm_isdst
        # figure out when moonset start:
                ms_hours = ms.next_setting(moon, use_center=True).tuple()[3]
        #ms_hours will be in 24-hour GMT.
                if isdst == 1: #add -4 to the time for DST
                        ms_hours = ms_hours - 4
                else: #add 5 to the time for EST
                        ms_hours = ms_hours - 5
                        ms_minutes = ms.next_setting(moon, use_center=True).tuple()[4]
                        ms_time = datetime.time(ms_hours, ms_minutes)

#                print "Current Time, Cival Time, Sunrise Time, Sun Transit time, Sunset time, Cival Time end"
		print now_time, sctl_time, sunrise_time, suntransit_time, sunset_time, sctle_time
                print now_time, mr_time, mt_time, ms_time

                if now_time >= sctl_time and now_time <= sctle_time:
                        print "Civil Twilight is in effect" 
			GPIO.output(11,False)
                elif now_time <= sctl_time or now_time >= sctle_time:
                        print "Civil Twilight is not in effect"
			GPIO.output(11,True)

                if now_time >= sunrise_time and now_time <= sunset_time:
                        print "Sun is shining"
			GPIO.output(13,False)
                elif now_time <= sunrise_time or now_time >= sunset_time:
                        print "Sun is not shining"
			GPIO.output(13,True)

                if now_time >= suntransit_time and now_time <= stob_time:
			print "Sun is in Transit 12'O Clock Position" 
			GPIO.output(15,False)
                elif now_time <= suntransit_time or now_time >= stob_time:
			print "Sun is not in Transit 12'O Clock Position"
                        GPIO.output(15,True)

                if now_time >= mr_time and now_time <= ms_time:
			print "Moon is above horrizon"
                        GPIO.output(16,False)
                elif now_time <= mr_time or now_time >= ms_time:
			print "Moon is below horrizon"
                        GPIO.output(16,True)


                time.sleep(30)
