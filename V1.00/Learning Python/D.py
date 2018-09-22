#!/usr/bin/env python

import datetime
import ephem # to install, type$ pip install pyephem



UTC = -5
LAT = "31.166667"
LONG = "-81.483333"
def calculate_time1(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-6'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour ).datetime().strftime('%H:%M')

for Twilight, Begin in { "Begin civil twilight": dict (lat=LAT, long=LONG,
                                         is_rise=True,
                                         utc_time=UTC),}.items():
    print Twilight, calculate_time(**Begin)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Sunrise, Begin in { "" :dict (lat=LAT, long=LONG,
                                         is_rise=True,
                                         utc_time=UTC),}.items():
    print Sunrise, calculate_time(**Begin)
print calculate_time
