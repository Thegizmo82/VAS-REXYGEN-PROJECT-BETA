
# Imports
import webiopi
import time
import sys
import subprocess
import re
import smbus
from smbus import SMBus
from ctypes import c_short
sys.path.append("/home/pi/webiopi/htdocss")  #<--- or whatever your path is !

# Enable debug output
webiopi.setDebug()

from webiopi.devices.sensor import DS18B20
temp0 = DS18B20(slave="28-0000045328a0")     #<--- your sensor numbers as defined in config file
temp1 = DS18B20(slave="28-000004de52e9")
temp2 = DS18B20(slave="28-000004816b68")
temp3 = DS18B20(slave="28-000004f8f104")
temp4 = DS18B20(slave="28-00000515fd8f")
temp5 = DS18B20(slave="28-000005164c50")
temp6 = DS18B20(slave="28-000004f87ee5")
temp7 = 0

# Retrieve GPIO lib
GPIO = webiopi.GPIO

LED0 = 18
LED1 = 21

global T, Temp0, Temp1, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7
global D11_Humidity, D11_Temperature

T, Temp0, Temp1, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7 = 0, 0, 0, 0, 0, 0, 0, 0, 0
D11_Humidity, D11_Temperature = 0, 0


# Called by WebIOPi at script loading
def setup():
    webiopi.debug("Blink script - Setup")
    # Setup GPIOs

    GPIO.setFunction(LED0, GPIO.OUT)
    GPIO.setFunction(LED1, GPIO.OUT)
#------------------------------------------------------------------
def get_Humidity():
    global D11_Humidity, D11_Temperature
    Last_Humidity = D11_Humidity
    Last_Temperature = D11_Temperature
    try:
        for x in range (3):
            try:
                output = subprocess.check_output(["/home/pi/webiopi/htdocss/DHT", "11", "8"]); # sensor type "11" or "22" , gpio pin "8" or "X" X being your connected gpio pin
                #print (output)
            except Exception, e:
                print (e)
                print("Unable to access D11 c output")
                pass
            matches = re.search("Temp =\s+([0-9.]+)", output)
            if (matches):
                temp = float(matches.group(1))                       
                matches = re.search("Hum =\s+([0-9.]+)", output)
                humidity = float(matches.group(1))
                D11_Temperature = "%.2f" % temp
                D11_Humidity = "%.0f" % humidity
                break
            else:
                D11_Temperature = Last_Temperature
                D11_Humidity = Last_Humidity            
        print (D11_Temperature, D11_Humidity)
        return D11_Temperature, D11_Humidity
    except Exception, e:
        print (e)
        print("Unable to access D11")
        pass
#------------------------------------------------------------------
def get_DS18B20_Temperature():
    global T, Temp0, Temp1, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7
    if T == 8:
        T = 0
    print (T)
    try:
        if T == 0:
            Temp0 = "%.2f" % (temp0.getCelsius())
        if T == 1:    
            Temp1 = "%.2f" % (temp1.getCelsius())  
        if T == 2: 
            Temp2 = "%.2f" % (temp2.getCelsius())
        if T == 3:  
            Temp3 = "%.2f" % (temp4.getCelsius())
        if T == 4: 
            Temp4 = "%.2f" % (temp3.getCelsius())
        if T == 5: 
            Temp5 = "%.2f" % (temp5.getCelsius())
        if T == 6: 
            Temp6 = "%.2f" % (temp6.getCelsius())
        if T == 7: 
            Temp7 = 0
        T +=1
        print (Temp0, Temp1, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7)
        return Temp0, Temp1, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7
    except (IOError, TypeError):
        print ("ERROR getting temp"), (T)
        T +=1    # this line if you want to retry the same sensor that produced an error again next time.
        pass
#------------------------------------------------------------------

# Looped by WebIOPi
def loop():
    # Toggle LED each 5 seconds
    value = not GPIO.digitalRead(LED0)
    GPIO.digitalWrite(LED0, value)
    webiopi.sleep(5)



# Called by WebIOPi at server shutdown
def destroy():
    webiopi.debug("Blink script - Destroy")
    # Reset GPIO functions
    GPIO.setFunction(LED0, GPIO.IN)
    GPIO.setFunction(LED1, GPIO.IN)

# Macro called by WebIOPi to retreve 7off DS18B20 Temp sensors and DH11 Temp/Humidity sensor
@webiopi.macro
def Temp(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9):
    get_DS18B20_Temperature()
    get_Humidity()
    return ("%s %s %s %s %s %s %s %s %s %s" % (Temp0, Temp1, Temp2, Temp3, Temp4, Temp5, Temp6, Temp7, D11_Temperature, D11_Humidity))


# Macro called by WebIOPi to retreve the state of GPIO21
@webiopi.macro
def GETPIO(arg0):
    g0 = (int(GPIO.digitalRead(21)))
    #print g0
    return ("%s" % (g0))



















 
