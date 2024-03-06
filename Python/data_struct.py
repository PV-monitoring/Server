from data_struct_fun import real_time
from data_struct_fun import pre_date_time_fun
from data_struct_fun import pred_power_range
from data_struct_fun import pre_15_val
import numpy as np
import datetime


#power clusters
under = [9,7,14,11,10,15,5,13,0]
normal = [3,2,1,6,15,11]

#pred_cluster
pred_cluster = None

#time range
morning = [5,8]
evening = [16,18]


#dont use until get the irradiance data
#irradiance_range = [0.6,0.9]

#should get from API
faulty_flag = 0

#taking new data
new_data = real_time()
lst_row = new_data[1]
to_pred = new_data[0]

#normal_under_performance 
rt_hour = to_pred[-2]

#cloudy_check
lst_15 = np.array(pre_15_val())
lst_15_power = []
for i in range(len(lst_15)):
    lst_15_power.append(float(lst_15[i][1]))
    
pre_date_time = np.array(pre_date_time_fun(lst_row))
pre_power = []
pre_clusters = []
for i in range(len(pre_date_time)):
    pre_power.append(float(pre_date_time[i][1]))
    pre_clusters.append(pre_date_time[i][-1])

#Shading check
##power_range = pred_power_range(pre_date_time,under)




# time = lst_row[0][11:16]
# time_obj = datetime.datetime.strptime(time, "%H:%M").time()

print(lst_row)
print(to_pred)
print(rt_hour)
print(lst_15_power)
print(pre_date_time)
print(pre_power)
print(pre_clusters)
#print(power_range)
# print(irradiance)
# print(time_obj)
# print(pred_irradiance)






