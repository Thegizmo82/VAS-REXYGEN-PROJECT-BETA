from datetime import datetime, time
now = datetime.now()
now_time = now.time()
TSH1 = 9
TSM1 = 30
TEH1 = 21
TEM1 = 47
time_start = time(TSH1,TSM1)
time_end = time(TEH1,TEM1)

if now_time >= time_start and now_time <= time_end:
    print "yes, within the interval"
elif now_time <= time_start or now_time >= time_end:
    print "not, within the interval"

