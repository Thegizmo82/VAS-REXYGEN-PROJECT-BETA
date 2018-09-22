#!/usr/bin/env python
import datetime
import time
import ephem

def calculate_time(lat, long, is_rise, is_civil_twilight, is_sun, utc_time, dst_time):
    o = ephem.Observer()
    o.pressure = 0
    civil_twilight o.horizon = '-6' if is_civil_twilight else o.horizon = '-0:34' 
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    moon = ephem.Moon(o)
    next_event = o.next_rising if is_rise else o.next_setting
    event_sun = sun if is_sun else moon
    return ephem.Date(next_event(event_sun, use_center=True, start=o.date) + (utc_time + dst_time) *ephem.hour
                      ).datetime().strftime('%H:%M')

for twilight, Begin in { "Begin civil twilight": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         is_sun=True,
                                         is_civil_twilight=True,
                                         utc_time=-5,
                                         dst_time=1),}.items():
    print twilight, calculate_time(**Begin)
