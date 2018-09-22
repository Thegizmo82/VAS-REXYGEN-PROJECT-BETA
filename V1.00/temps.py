#!/usr/bin/env python

import MySQLdb
import time
import datetime

db = MySQLdb.connect("localhost", "root", "Thegizmo@1982", "temps")
curs=db.cursor()
date = time.strftime("%d/%m/%Y")
clock = time.strftime("%H:%M")


# note that I'm using triplle quotes for formatting purposes
# you can use one set of double quotes if you put the whole string on one line
try:
    curs.execute ("""INSERT INTO tempdat(tdate, ttime, temperature, zone)
            values(CURRENT_DATE(), NOW(), 19.4, 21.7)""")




    db.commit()
    print "Data committed"

except:
    print "Error: the database is being rolled back"
#    db.rollback()

