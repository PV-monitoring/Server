from db_connection import fetch_lastrow_data
from db_connection import fetch_specific_row_data
from db_connection import fetch_last_n_rows
from db_connection import connect_to_database
from db_connection import get_average_power_for_date
import datetime
import numpy as np

def real_time():
    date_time = np.array(fetch_lastrow_data())
    datetime_obj = datetime.datetime.strptime(date_time[0], "%Y-%m-%d %H:%M:%S")

    # Extract relevant features from datetime object
    year = datetime_obj.year
    month = datetime_obj.month
    day = datetime_obj.day
    hour = datetime_obj.hour
    minute = datetime_obj.minute
    second = datetime_obj.second
    
    real_time_data = []
    to_pred = []
    for i in range(1, len(date_time)):  # Corrected range syntax
        to_pred.append(float(date_time[i]))
    
    # Append hour and minute separately
    to_pred.append(hour)
    to_pred.append(minute)   
    real_time_data.append(to_pred)
    real_time_data.append(date_time)
    
    return real_time_data


def pre_date_time_fun(date_time):
    comparison_string = date_time[0][11:16]
    condition = f"SUBSTRING(Time, 12, 5) = '{comparison_string}'"
    pre_date_time = fetch_specific_row_data(condition)
    print(comparison_string)
    return pre_date_time


# def pre_date_time_fun(date_time):
#     comparison_time = datetime.datetime.strptime(date_time[0][11:16], "%H:%M")
#     comparison_time_minus_1 = comparison_time - datetime.timedelta(minutes=1)
#     comparison_time_plus_1 = comparison_time + datetime.timedelta(minutes=1)

#     condition = f"(SUBSTRING(Time, 12, 5) = '{comparison_time_minus_1.strftime('%H:%M')}' OR " \
#                 f"SUBSTRING(Time, 12, 5) = '{comparison_time.strftime('%H:%M')}' OR " \
#                 f"SUBSTRING(Time, 12, 5) = '{comparison_time_plus_1.strftime('%H:%M')}')"

#     pre_date_time = fetch_specific_row_data(condition)
#     print(comparison_time)
#     return pre_date_time


def pred_power_range(pre_date_time,under):
    all_power = []
    min_max_p = [] 
    for p in range (len(pre_date_time)) :
        if int(pre_date_time[p][-1]) not in  under :
            all_power.append(pre_date_time[p][1])
    min_max_p.append(min(all_power))
    min_max_p.append(max(all_power))
    return min_max_p

def pre_15_val():
    data = fetch_last_n_rows(15,"Time")
    return data

def get_average_power_last_30_days():
    connection = connect_to_database()
    if connection is None:
        return None

    cursor = connection.cursor()
    today = datetime.date(2023, 7, 12)  # Correctly specify the date
    average_powers = []

    for i in range(20):
        date = today - datetime.timedelta(days=i)
        avg_power = get_average_power_for_date(date, cursor)
        average_powers.append((date, avg_power))
    
    connection.close()
    return average_powers
