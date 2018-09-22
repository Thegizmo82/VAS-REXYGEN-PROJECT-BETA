import datetime
import time
import ephem # to install, type$ pip install pyephem


# Current location:
#Country = USA
#City = Brunswick
#State = GA
#Zip Code = 31525
LAT = '31.166667'
LOG = '-81.483333'
DST_OFFSET = -5
# Start of Sunrise Observer Settings:
ms=ephem.Observer()
ms.pressure = 0
ms.horizon = '-0:34'
ms.lat= LAT
ms.lon= LOG
ms.date = datetime.date.today()

# Sun or Moon PyEphem Selection: 
sun = ephem.Sun()
moon = ephem.Moon()

ms_time = ephem.Date(ms.next_setting(moon, use_center=True, start=ms.date) + DST_OFFSET *ephem.hour
                     ).datetime().strftime('%H:%M')


print ms_time
