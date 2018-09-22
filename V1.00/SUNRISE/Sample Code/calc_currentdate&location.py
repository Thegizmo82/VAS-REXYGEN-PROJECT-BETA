#!/usr/bin/env python
import datetime
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
                                         utc_time=-5),}.items():
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
                                         utc_time=-5),}.items():
    print town, calculate_time(**kwarg)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    sun = ephem.Sun(o)
    next_event = o.next_transit if is_rise else o.next_setting
    return ephem.Date(next_event(sun, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Sun transit": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=-5),}.items():
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
                                         utc_time=-5),}.items():
    print town, calculate_time(**kwarg)

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
                                         utc_time=-5),}.items():
    print town, calculate_time(**kwarg)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.previous_rising if is_rise else o.previous_setting
    return ephem.Date(next_event(moon, use_center=False, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Moonrise on preceding day": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=-5),}.items():
    print town, calculate_time(**kwarg)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.previous_transit if is_rise else o.next_transit
    return ephem.Date(next_event(moon, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Moon transit": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=-5),}.items():
    print town, calculate_time(**kwarg)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.next_transit if is_rise else o.next_setting
    return ephem.Date(next_event(moon, use_center=False, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Moonset": dict (lat='31.166667', long='-81.483333',
                                         is_rise=False,
                                         utc_time=-5),}.items():
    print town, calculate_time(**kwarg)

def calculate_time(lat, long, is_rise, utc_time):
    o = ephem.Observer()
    o.pressure = 0
    o.horizon = '-0:34'
    o.lat, o.long, o.date = lat, long, datetime.date.today()
    moon = ephem.Moon(o)
    next_event = o.next_rising if is_rise else o.next_setting
    return ephem.Date(next_event(moon, use_center=False, start=o.date) + utc_time *ephem.hour
                      ).datetime().strftime('%H:%M')

for town, kwarg in { "Moonrise": dict (lat='31.166667', long='-81.483333',
                                         is_rise=True,
                                         utc_time=-5),}.items():
    print town, calculate_time(**kwarg)

