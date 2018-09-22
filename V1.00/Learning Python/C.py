#!/usr/bin/env python

import datetime
import ephem # to install, type$ pip install pyephem



UTC = -5
def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-6'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "Begin civil twilight": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "Sunrise": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_transit if is_rise else o.next_setting
    return ephem.Date(next_event(sun, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "Sun transit": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "Sunset": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-6'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(sun, use_center=True, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "End civil twilight": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.previous_rising if is_rise else o.previous_setting
    return ephem.Date(next_event(moon, use_center=False, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "Moonrise on preceding day": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.previous_transit if is_rise else o.next_transit
    return ephem.Date(next_event(moon, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "Moon transit": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.next_transit if is_rise else o.next_setting
    return ephem.Date(next_event(moon, use_center=False, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, GA in { "Moonset": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(moon, use_center=False, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for Brunswick, G1 in { "Moonrise": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=UTC),}.items():
    print Brunswick, calculate_time(**GA)

from datetime import datetime, time
now = datetime.now()
now_time = now.time()
time_start = time (12,0)
time_end = time (13,0)

if now_time >= time_start and now_time <= time_end:
    print "yes, within the interval"
elif now_time <= time_start or now_time >= time_end:
    print "not, within the interval"
