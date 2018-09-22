#!/usr/bin/env python
# program calculates sunset each day and turns the lamp on 30 minutes before

# then the program calculates a random minute to turn the lamp off within an hour after midnight.



# REMEMBER TO USE 24-HOUR TIME FORMAT

# AND THAT PYEPHEM USES UTC/GMT AND NOT EST

import time
import datetime
import ephem

# figure out what time it is now
now = datetime.datetime.now()
now_hours = time.localtime(time.time())[3]
now_minutes = time.localtime(time.time())[4]
# provide the program with information about the current location:
# HS = Hobe Sound
HS=ephem.Observer()
HS.lat='31.166667'
HS.lon='-81.483333'
HS.date = now
sun = ephem.Sun() 
# figure out if it is daylight savings time or not:
# isdst will be 1 if DST is currently enforced, 0 otherwise
isdst = time.localtime().tm_isdst
# figure out when sunset is:
sunset_hours = HS.next_setting(sun).tuple()[3]
#sunset_hours will be in 24-hour GMT.
if isdst == 1: #add 20 to the time for DST
    sunset_hours = sunset_hours - 4
else: #add 19 to the time for EST
    sunset_hours = sunset_hours - 5
    sunset_minutes = HS.next_setting(sun).tuple()[4]

print HS.next_setting(sun).datetime().strftime('%H:%M')
