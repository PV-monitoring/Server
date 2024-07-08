import numpy as np
from scipy.optimize import differential_evolution
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

def exponential_decay(t, P0, alpha):
    return P0 * np.exp(-alpha*t)

# Example data
time = np.array([1, 2, 3, 4, 6, 7, 8])  # days since last cleaning
power_output = np.array([0.99004983,0.98019867,0.97044553,0.96078944,0.94176453,0.93239382,0.92311635])  # normalized power output

# Initial guess for P0 and alpha
initial_guess = [1, 0.01]

# Curve fitting
popt, pcov = curve_fit(exponential_decay, time, power_output, p0=initial_guess)

# Extracting the fitted parameters
P0, alpha = popt
print(f"Initial Power Output (P0): {P0}")
print(f"Dirt Accumulation Rate (alpha): {alpha}")

# Parameters
initial_power_output = P0*100*15000  # in watts
dirt_accumulation_rate = alpha  # power loss percentage per day
cleaning_cost_per_cycle = 50  # in dollars
power_value_per_watt_per_day = 0.001  # in dollars

# Function to model power loss due to dirt accumulation
def power_loss(days, initial_power_output, dirt_accumulation_rate):
    return initial_power_output * ((1 - dirt_accumulation_rate) ** days)

# Function to calculate total cost for a given cleaning cycle interval
def total_cost(cycle_interval, initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day):
    cycle_interval = int(cycle_interval)
    num_cycles_per_year = 365 / cycle_interval
    annual_cleaning_cost = num_cycles_per_year * cleaning_cost_per_cycle
    
    # Sum the daily power losses over the cycle interval to get the total power loss over the interval
    total_power_loss = sum([initial_power_output - power_loss(day, initial_power_output, dirt_accumulation_rate) for day in range(1, cycle_interval + 1)])
    
    # Calculate the average daily power loss over the cycle interval
    average_daily_power_loss = total_power_loss / cycle_interval
    
    # Annual power loss cost is the average daily power loss multiplied by 365 days and the value per watt per day
    annual_power_loss_cost = average_daily_power_loss * 365 * power_value_per_watt_per_day
    
    # Total annual cost is the sum of the annual cleaning cost and the annual power loss cost
    return annual_cleaning_cost + annual_power_loss_cost

# Optimize the cleaning cycle interval using differential evolution
bounds = [(1, 365)]
result = differential_evolution(total_cost, bounds, args=(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day))

optimal_cycle_interval = int(result.x[0])
optimal_cost = result.fun

print(f"Optimal Cleaning Cycle Interval (Differential Evolution): {optimal_cycle_interval} days")
print(f"Total Annual Cost (Differential Evolution): ${optimal_cost:.2f}")

# Case 1
initial_power_output = 2000  # in watts
dirt_accumulation_rate = 0.02  # power loss percentage per day
cleaning_cost_per_cycle = 100  # in dollars
power_value_per_watt_per_day = 0.002  # in dollars

result = differential_evolution(total_cost, bounds, args=(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day))
optimal_cycle_interval = int(result.x[0])
optimal_cost = result.fun

print(f"Case 1 - Optimal Cleaning Cycle Interval (Differential Evolution): {optimal_cycle_interval} days")
print(f"Case 1 - Total Annual Cost (Differential Evolution): ${optimal_cost:.2f}")

# Case 2
initial_power_output = 1500  # in watts
dirt_accumulation_rate = 0.015  # power loss percentage per day
cleaning_cost_per_cycle = 75  # in dollars
power_value_per_watt_per_day = 0.0015  # in dollars

result = differential_evolution(total_cost, bounds, args=(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day))
optimal_cycle_interval = int(result.x[0])
optimal_cost = result.fun

print(f"Case 2 - Optimal Cleaning Cycle Interval (Differential Evolution): {optimal_cycle_interval} days")
print(f"Case 2 - Total Annual Cost (Differential Evolution): ${optimal_cost:.2f}")
