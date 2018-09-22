# Raspberry Pi custom Christmas light timer

# import GPIO module
import RPi.GPIO as GPIO

# set up GPIO pins as outputs
# This convention is for the "P1" header pin convention
# where the pins start with P1 in the upper left
# and go to P26 in the lower right, with odds in the
# left column and evens in the right column.
# So, pins P1-11 and P1-12 correspond to GPIO17 and
# GPIO18 respectively.
GPIO.setmode(GPIO.BOARD)
GPIO.setup(11, GPIO.OUT)
GPIO.setup(12, GPIO.OUT)

# import date and time modules
import datetime
import time

# Enter the times you want the lights to turn on and off for
# each day of the week. Default is for lights to turn on at
# 5:30pm and off at 10:30pm on weekdays, on at 5:00pm and off
# at 11:30pm on weekends. Note that this is using a 24-hour clock.

UVB_H1  = datetime.time(hour=17,minute=30,second=0)
UVB_H0 = datetime.time(hour=22,minute=30,second=0)
UVB_C1  = datetime.time(hour=17,minute=30,second=0)
UVB_C0 = datetime.time(hour=22,minute=30,second=0)
UVA_H1  = datetime.time(hour=17,minute=30,second=0)
UVA_H0 = datetime.time(hour=22,minute=30,second=0)
AUX_1  = datetime.time(hour=17,minute=30,second=0)
AUX_0 = datetime.time(hour=22,minute=30,second=0)

# Store these times in an array for easy access later.
OnTime = [UVB_H1]
OffTime = [UVB_H0]

# Set a "wait time" in seconds. This ensures that the program pauses
# briefly after it turns the lights on or off. Otherwise, since the
# loop will execute more than once a second, it will try to keep
# turning the lights on when they are already on (or off when they are
# already off.

waitTime = 3

# Start the loop that will run until you stop the program or turn
# off your Raspberry Pi.

while True:

    # get the current time in hours, minutes and seconds
    currTime = datetime.datetime.now()
    # get the current day of the week (0=Monday, 1=Tuesday, 2=Wednesday...)
    currDay = datetime.datetime.now().weekday()

    #Check to see if it's time to turn the lights on
    if (currTime.hour - OnTime[currDay].hour == 0 and
        currTime.minute - OnTime[currDay].minute == 0 and
        currTime.second - OnTime[currDay].second == 0):

        # set the GPIO pin to HIGH, equivalent of
        # pressing the ON button on the remote
        GPIO.output(11, GPIO.HIGH)

        # wait for a very short period of time then set
        # the value to LOW, the equivalent of releasing the
        # ON button
        time.sleep(.5)
        GPIO.output(11, GPIO.LOW)

        # wait for a few seconds so the loop doesn't come
        # back through and press the "on" button again
        # while the lights ae already on
        time.sleep(waitTime)

    #check to see if it's time to turn the lights off
    elif (currTime.hour - OffTime[currDay].hour == 0 and
        currTime.minute - OffTime[currDay].minute == 0 and
        currTime.second - OffTime[currDay].second == 0):

        # set the GPIO pin to HIGH, equivalent of
        # pressing the OFF button on the remote
        GPIO.output(12, GPIO.HIGH)

        # wait for a very short period of time then set
        # the value to LOW, the equivalent of releasing the
        # OFF button
        time.sleep(.5)
        GPIO.output(12, GPIO.LOW)

        # wait for a few seconds so the loop doesn't come
        # back through and press the "off" button again
        # while the lights ae already off
        time.sleep(waitTime)
