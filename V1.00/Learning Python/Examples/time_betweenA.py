import time
import datetime

startTime = datetime.datetime(2015, 9, 4, 20, 50, 0)
endTime = datetime.datetime(2015, 9, 4, 20, 51, 0)
while True:
    currTime = datetime.datetime.now()
    
    if (datetime.datetime.now() > startTime and
        datetime.datetime.now() < endTime):
    

        print('System Active')

    elif (datetime.datetime.now() > endTime or
        datetime.datetime.now() < startTime):

        print ('System NON-Active')

#startTime > datetime.datetime.now():
#endTime < datetime.datetime.now()

