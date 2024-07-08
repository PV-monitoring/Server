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


# Generate fitted curve
fitted_curve = exponential_decay(time, P0, alpha)

# Plot data and fitted curve
plt.scatter(time, power_output, label='Data')
plt.plot(time, fitted_curve, label='Fitted Curve', color='red')
plt.xlabel('Time (days)')
plt.ylabel('Normalized Power Output')
plt.title('Exponential Decay Fit for Dirt Accumulation')
plt.legend()
plt.show()
