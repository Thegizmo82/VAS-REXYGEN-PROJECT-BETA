import datetime as dt
import ephem as ep

date = dt.datetime.now().strftime("%Y/%m/%d 00:00:00")
lat, lon = [<redacted>, -1.4147]

# Use lat and lon to create ephem observer instance and update with given
# values
my_location = ep.Observer()
my_location.lat = lat
my_location.lon = lon
my_location.date = date

# Get sunrise of the current day
sunrise = my_location.next_rising(ep.Sun())
sunset = my_location.next_setting(ep.Sun())

print "Given date: {0}".format(date)
print "Detected coordinates: {0}, {1}".format(lat, lon)
print "Sunrise at {0}".format(sunrise)
print " Sunset at {0}".format(sunset)
