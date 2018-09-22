#!/usr/bin/env python
import datetime
import ephem # to install, type$ pip install pyephem

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, start=o.date) + utc_time*ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "HOME SUNRISE": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=-4),
                                         
                     "HOME SUMSET": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=-4),}.items():
                                         

                     #"Brunswick, GA (-2)": dict(d=31, m=8, y=2015,
                     #               lat='31.166667', long='-81.483333',
                     #               is_rise=True,
                     #               utc_time=-2) ,

                     #"Brunswick, GA (-3)": dict(d=31, m=8, y=2015,
                     #               lat='31.166667', long='-81.483333',
                     #               is_rise=True,
                     #               utc_time=-3) ,

                     #"Brunswick, GA (-4)": dict(d=31, m=8, y=2015,
                     #               lat='31.166667', long='-81.483333',
                     #               is_rise=False,
                     #               utc_time=-4) ,

                     #"Brunswick, GA (-5)": dict(d=31, m=8, y=2015,
                     #               lat='31.166667', long='-81.483333',
                     #               is_rise=True,
                     #               utc_time=-5) }.items():
    print town, calculate_time(**kwarg)
