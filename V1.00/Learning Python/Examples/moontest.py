#!/usr/bin/python
import datetime
import ephem
import os
import time

# Set time zone to pacific
os.environ['TZ'] = 'US/Pacific'
time.tzset()

print("Time zone calibrated to", os.environ['TZ'])

def get_full_moons_in_year(year):
    """
    Generate a list of full moons for a given year calibrated to the local time zone
    :param year: year to determine the list of full moons
    :return: list of dates as strings in the format YYYY-mm-dd
    """
    moons = []

    date = ephem.Date(datetime.date(year - 1, 12, 31))
    end_date = ephem.Date(datetime.date(year + 1, 1, 1))

    while date <= end_date:
        date = ephem.next_full_moon(date)

        # Convert the moon dates to the local time zone, add to list if moon date still falls in desired year
        local_date = ephem.localtime(date)
        if local_date.year == year:
            # Append the date as a string to the list for easier comparison later
            moons.append(local_date.strftime("%Y-%m-%d"))

    return moons

moons = get_full_moons_in_year(2015)
print(moons)
