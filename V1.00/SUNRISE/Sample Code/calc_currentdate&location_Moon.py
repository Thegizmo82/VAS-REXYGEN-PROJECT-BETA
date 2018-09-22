#!/usr/bin/env python
import datetime
import ephem # to install, type$ pip install pyephem

def calculate_time(lat, long, is_rise, utc_time, dst_time):
    o = ephem.Observer()
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(moon, start=o.date) + utc_time + dst_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "HOME SUNRISE": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=4,
                                         dst_time=0),
                     "HOME SUMSET": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=4,
                                         dst_time=0),}.items(): 
    print town, calculate_time(**kwarg)
