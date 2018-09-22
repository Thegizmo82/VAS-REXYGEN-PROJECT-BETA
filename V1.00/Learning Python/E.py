#!/usr/bin/env python

import datetime
import ephem # to install, type$ pip install pyephem

d = ephem.Date('2015/11/11 14:00')
ephem.localtime(d)
print(ephem.localtime(d).ctime())
