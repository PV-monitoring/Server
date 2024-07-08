import numpy as np
from scipy.optimize import minimize

# Parameters
initial_power_output = 1000  # in watts
dirt_accumulation_rate = 0.01  # power loss percentage per day
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

# Function to optimize the cleaning cycle interval using different methods
def optimize_cleaning_cycle(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day, method):
    result = minimize(total_cost, x0=[30], args=(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day), bounds=[(1, 365)], method=method)
    optimal_cycle_interval = int(result.x[0])
    optimal_cost = result.fun
    return optimal_cycle_interval, optimal_cost

# Default case with different methods
methods = ['Nelder-Mead', 'Powell', 'TNC']

for method in methods:
    optimal_cycle_interval, optimal_cost = optimize_cleaning_cycle(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day, method)
    print(f"Method: {method}")
    print(f"Optimal Cleaning Cycle Interval: {optimal_cycle_interval} days")
    print(f"Total Annual Cost: ${optimal_cost:.2f}\n")

# Case 1
initial_power_output = 2000  # in watts
dirt_accumulation_rate = 0.02  # power loss percentage per day
cleaning_cost_per_cycle = 100  # in dollars
power_value_per_watt_per_day = 0.002  # in dollars

for method in methods:
    optimal_cycle_interval, optimal_cost = optimize_cleaning_cycle(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day, method)
    print(f"Case 1 - Method: {method}")
    print(f"Case 1 - Optimal Cleaning Cycle Interval: {optimal_cycle_interval} days")
    print(f"Case 1 - Total Annual Cost: ${optimal_cost:.2f}\n")

# Case 2
initial_power_output = 1500  # in watts
dirt_accumulation_rate = 0.015  # power loss percentage per day
cleaning_cost_per_cycle = 75  # in dollars
power_value_per_watt_per_day = 0.0015  # in dollars

for method in methods:
    optimal_cycle_interval, optimal_cost = optimize_cleaning_cycle(initial_power_output, dirt_accumulation_rate, cleaning_cost_per_cycle, power_value_per_watt_per_day, method)
    print(f"Case 2 - Method: {method}")
    print(f"Case 2 - Optimal Cleaning Cycle Interval: {optimal_cycle_interval} days")
    print(f"Case 2 - Total Annual Cost: ${optimal_cost:.2f}\n")
