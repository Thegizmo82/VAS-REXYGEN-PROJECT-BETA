#!/usr/bin/env python
from datetime import datetime, time
now = datetime.now()
now_time = now.time()
TIME-A = 10,30
TIME-B = 22,30

if now_time >= TIME-A() and now_time <= TIME-B():
    print "yes, within the interval"
