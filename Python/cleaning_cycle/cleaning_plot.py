import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit

# Example data
time = np.array([1, 2, 3, 4, 6, 7, 8])  # days since last cleaning
# power_values = get_average_power_last_30_days()
power_output = np.array([0.99004983, 0.98019867, 0.97044553, 0.96078944, 0.94176453, 0.93239382, 0.92311635])  # normalized power output

# Exponential decay function for power loss
def exponential_decay(t, P0, alpha):
    return P0 * np.exp(-alpha * t)

# Initial guess for P0 and alpha
initial_guess = [1, 0.01]

# Curve fitting
popt, _ = curve_fit(exponential_decay, time, power_output, p0=initial_guess)

# Extracting the fitted parameters
P0, alpha = popt
print(f"Initial Power Output (P0): {P0}")
print(f"Dirt Accumulation Rate (alpha): {alpha}")

# Parameters
initial_power_output = P0 * 100 * 20000 # in watts
dirt_accumulation_rate = 0.0001  # power loss percentage per day
cleaning_cost_per_cycle = 234  # in dollars
power_value_per_watt_per_day = 0.0001  # in dollars

# Function to model power loss due to dirt accumulation
def power_loss(days, initial_power_output, dirt_accumulation_rate):
    return initial_power_output * ((1 - dirt_accumulation_rate) ** days)

# Function to calculate power loss cost for a given cleaning cycle interval
def power_loss_cost(cycle_interval, initial_power_output, dirt_accumulation_rate, power_value_per_watt_per_day):
    cycle_interval = int(cycle_interval)  # Ensure cycle_interval is an integer
    total_power_loss = sum([initial_power_output - power_loss(day, initial_power_output, dirt_accumulation_rate) for day in range(1, cycle_interval + 1)])
    average_daily_power_loss = total_power_loss / cycle_interval
    return average_daily_power_loss * power_value_per_watt_per_day * cycle_interval

# Range of cleaning cycle intervals to evaluate
cycle_intervals = np.arange(1, 366)

# Calculate power loss cost for each cleaning cycle interval
power_loss_costs = [power_loss_cost(interval, initial_power_output, dirt_accumulation_rate, power_value_per_watt_per_day) for interval in cycle_intervals]

# Find the cycle interval where the cleaning cost per cycle is equal to the power loss cost
optimal_cycle_interval = cycle_intervals[np.argmin(np.abs(np.array(power_loss_costs) - cleaning_cost_per_cycle))]
optimal_power_loss_cost = power_loss_cost(optimal_cycle_interval, initial_power_output, dirt_accumulation_rate, power_value_per_watt_per_day)

print(f"Optimal Cleaning Cycle Interval: {optimal_cycle_interval} days")
print(f"Power Loss Cost at Optimal Interval: ${optimal_power_loss_cost:.2f}")

# Plotting
plt.figure(figsize=(10, 6))

# Plot cleaning cost per cycle as a constant
plt.plot(cycle_intervals, [cleaning_cost_per_cycle] * len(cycle_intervals), label='Cleaning Cost per Cycle', color='b')

# Plot power loss cost
plt.plot(cycle_intervals, power_loss_costs, label='Power Loss Cost', color='g')
plt.scatter(optimal_cycle_interval, optimal_power_loss_cost, color='r', zorder=5, label='Optimal Point')
plt.axvline(x=optimal_cycle_interval, color='red', linestyle='--', linewidth=1)

plt.xlabel('Cleaning Cycle Interval (days)')
plt.ylabel('Cost (dollars)')
plt.title('Optimization of Cleaning Cycle Interval')
plt.legend()
plt.grid(True)
plt.show()
