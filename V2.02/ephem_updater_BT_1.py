import ephem
import datetime
import time
import socket
import struct

atlanta = ephem.Observer()
atlanta.pressure = 0
atlanta.horizon = '-0:34'

atlanta.lat, atlanta.lon = '31.149952800', '-81.491489400'
atlanta.date = datetime.date.today() # noon EST

sctl = (atlanta.previous_rising(ephem.Sun()))
print sctl
ldt = ephem.localtime(sctl)
ldt_h = ephem.localtime(sctl).strftime('%H')
ldt_m = ephem.localtime(sctl).strftime('%M')
ldt_s = ephem.localtime(sctl).strftime('%S')
ldt_d = ephem.localtime(sctl).strftime('%d')
ldt_mo = ephem.localtime(sctl).strftime('%m')
ldt_y = ephem.localtime(sctl).strftime('%Y')

print ldt
print ldt_h
print ldt_m
print ldt_s
print ldt_d
print ldt_mo
print ldt_y
