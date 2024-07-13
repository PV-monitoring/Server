import numpy as np
from scipy.optimize import minimize
import matplotlib.pyplot as plt

# Parameters for the default case
initial_power_output_default = 1000  # in watts
dirt_accumulation_rate_default = 0.01  # power loss percentage per day
cleaning_cost_per_cycle_default = 50  # in dollars
power_value_per_watt_per_day_default = 0.001  # in dollars

# Parameters for Case 1
initial_power_output_case1 = 2000  # in watts
dirt_accumulation_rate_case1 = 0.02  # power loss percentage per day
cleaning_cost_per_cycle_case1 = 100  # in dollars
power_value_per_watt_per_day_case1 = 0.002  # in dollars

# Parameters for Case 2
initial_power_output_case2 = 1500  # in watts
dirt_accumulation_rate_case2 = 0.015  # power loss percentage per day
cleaning_cost_per_cycle_case2 = 75  # in dollars
power_value_per_watt_per_day_case2 = 0.0015  # in dollars

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

# Function to calculate average power output for a given cleaning cycle interval
def average_power_output(cycle_interval, initial_power_output, dirt_accumulation_rate):
    cycle_interval = int(cycle_interval)
    daily_power_outputs = [power_loss(day, initial_power_output, dirt_accumulation_rate) for day in range(1, cycle_interval + 1)]
    return np.mean(daily_power_outputs)

# Function to plot power loss vs cost
def plot_power_loss_vs_cost(cycle_intervals, costs, power_losses, optimal_cycle_interval, optimal_cost, method, case_label):
    plt.figure(figsize=(10, 6))
    plt.plot(power_losses, costs, label='Cost vs. Power Loss', color='b')
    plt.scatter(power_losses[optimal_cycle_interval-1], optimal_cost, color='r', zorder=5)
    plt.xlabel('Power Loss (watts)')
    plt.ylabel('Total Annual Cost (dollars)')
    plt.title(f'Power Loss vs. Cost - {case_label} ({method})')
    plt.grid(True)
    plt.legend()
    plt.show()

# Optimization methods to use
methods = ['Nelder-Mead', 'Powell', 'TNC']

# Default case
cycle_intervals = np.arange(1, 366)
for method in methods:
    optimal_cycle_interval, optimal_cost = optimize_cleaning_cycle(initial_power_output_default, dirt_accumulation_rate_default, cleaning_cost_per_cycle_default, power_value_per_watt_per_day_default, method)
    
    costs = [total_cost(interval, initial_power_output_default, dirt_accumulation_rate_default, cleaning_cost_per_cycle_default, power_value_per_watt_per_day_default) for interval in cycle_intervals]
    average_powers = [average_power_output(interval, initial_power_output_default, dirt_accumulation_rate_default) for interval in cycle_intervals]
    power_losses = [initial_power_output_default - avg_power for avg_power in average_powers]
    
    plot_power_loss_vs_cost(cycle_intervals, costs, power_losses, optimal_cycle_interval, optimal_cost, method, 'Default Case')

# Case 1
for method in methods:
    optimal_cycle_interval, optimal_cost = optimize_cleaning_cycle(initial_power_output_case1, dirt_accumulation_rate_case1, cleaning_cost_per_cycle_case1, power_value_per_watt_per_day_case1, method)
    
    costs = [total_cost(interval, initial_power_output_case1, dirt_accumulation_rate_case1, cleaning_cost_per_cycle_case1, power_value_per_watt_per_day_case1) for interval in cycle_intervals]
    average_powers = [average_power_output(interval, initial_power_output_case1, dirt_accumulation_rate_case1) for interval in cycle_intervals]
    power_losses = [initial_power_output_case1 - avg_power for avg_power in average_powers]
    
    plot_power_loss_vs_cost(cycle_intervals, costs, power_losses, optimal_cycle_interval, optimal_cost, method, 'Case 1')

# Case 2
for method in methods:
    optimal_cycle_interval, optimal_cost = optimize_cleaning_cycle(initial_power_output_case2, dirt_accumulation_rate_case2, cleaning_cost_per_cycle_case2, power_value_per_watt_per_day_case2, method)
    
    costs = [total_cost(interval, initial_power_output_case2, dirt_accumulation_rate_case2, cleaning_cost_per_cycle_case2, power_value_per_watt_per_day_case2) for interval in cycle_intervals]
    average_powers = [average_power_output(interval, initial_power_output_case2, dirt_accumulation_rate_case2) for interval in cycle_intervals]
    power_losses = [initial_power_output_case2 - avg_power for avg_power in average_powers]
    
    plot_power_loss_vs_cost(cycle_intervals, costs, power_losses, optimal_cycle_interval, optimal_cost, method, 'Case 2')
