import time
import sys
import math
import ephem

# These examples are designed to work in the Pacific timezone
import os
os.environ['TZ'] = 'America/Los_Angeles'
t = 1238180400
print timestamp_to_string(t)
almanac = Almanac(t, 46.0, -122.0)
