from datetime import date
from math import radians as rad,degrees as deg

import ephem

g = ephem.Observer()
g.name='Somewhere'
g.lat=rad(31.17288)  # lat/long in decimal degrees
g.long=rad(-81.47721)

m = ephem.Moon()

g.date = date.today()# local time zone, I'm in UTC+1
g.date -= ephem.hour # always everything in UTC

for i in range(24*4): # compute position for every 15 minutes
    m.compute(g)

    nnm = ephem.next_new_moon(g.date)
    pnm = ephem.previous_new_moon(g.date)
    # for use w. moon_phases.ttf A -> just past  newmoon,
    # Z just before newmoon
    # '0' is full, '1' is new
    # note that we cannot use m.phase as this is the percentage of the moon
    # that is illuminated which is not the same as the phase!
    lunation=(g.date-pnm)/(nnm-pnm)
    symbol=lunation*26
    if symbol < 0.2 or symbol > 25.8 :
        symbol = '1'  # new moon
    else:
        symbol = chr(ord('A')+int(symbol+0.5)-1)

    print(ephem.localtime(g.date).time(), deg(m.alt),deg(m.az),
      ephem.localtime(g.date).time().strftime("%H%M"),
      m.phase,symbol)
    g.date += ephem.minute*15
