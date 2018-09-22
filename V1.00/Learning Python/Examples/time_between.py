import time
import datetime

startTime = datetime.datetime(2015, 9, 4, 7, 4, 0)
endTime = datetime.datetime(2015, 9, 4, 19, 44, 0)
while (startTime > datetime.datetime.now()) or (endTime < datetime.datetime.now()):
    time.sleep(1)

print('System Active')

#startTime > datetime.datetime.now():
#endTime < datetime.datetime.now()

