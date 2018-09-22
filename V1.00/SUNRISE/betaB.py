#!/usr/bin/env python
import datetime
import time
import ephem # to install, type$ pip install pyephem

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-6'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Begin civil twilight": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=-4),}.items():
    print town, calculate_time(**kwarg)
    CivilTimeStart = town, calculate_time(**kwarg) 

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-6'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "End civil twilight": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=-4),}.items():
    CivilTimeEnd = town, calculate_time(**kwarg)
    print town, calculate_time(**kwarg)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Sunrise": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=-4),}.items():
    SunRiseStart = town, calculate_time(**kwarg)
    print town, calculate_time(**kwarg)
def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Sunset": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=-4),}.items():
    SunSetEnd = town, calculate_time(**kwarg)
    print town, calculate_time(**kwarg)
    
waitTime = 3

while True:

    # get the current time in hours, minutes and seconds
    currTime = datetime.datetime.now().strftime('%H:%M')
    # get the current day of the week (0=Monday, 1=Tuesday, 2=Wednesday...)
    #currDay = datetime.datetime.now().weekday()

    #Check to see if it's time to turn the lights on
    if (currTime < CivilTimeStart):# and
    #currTime < CivilTimeEnd):

        # set the GPIO pin to HIGH, equivalent of
        # pressing the ON button on the remote
        print ('UVB-H Active')
        print ('UVB-C Active')
        print ('CivilTimeStart')
        print ('currTime')

        # wait for a very short period of time then set
        # the value to LOW, the equivalent of releasing the
        # ON button
        #time.sleep(.5)
        #GPIO.output(11, GPIO.LOW)

        # wait for a few seconds so the loop doesn't come
        # back through and press the "on" button again
        # while the lights ae already on
        time.sleep(waitTime)

    #check to see if it's time to turn the lights off
    elif (currTime < CivilTimeEnd):# and
    #currTime > CivilTimeStart):

        # set the GPIO pin to HIGH, equivalent of
        # pressing the OFF button on the remote
        print ('UVB-H NON-Active')
        print ('UVB-C NON-Active')
        print ('CivilTimeEnd')
        print ('currTime')

        # wait for a very short period of time then set
        # the value to LOW, the equivalent of releasing the
        # OFF button
        #time.sleep(.5)
        #GPIO.output(12, GPIO.LOW)

        # wait for a few seconds so the loop doesn't come
        # back thro4ugh and press the "off" button again
        # while the lights ae already off
        time.sleep(waitTime)


