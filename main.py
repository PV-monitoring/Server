from output import Prediction
import state_machine
import data_struct
import joblib
import db_connection
from data_struct_fun import real_time
from data_struct_fun import pre_date_time_fun
#from data_struct_fun import pred_irradiance_range
import numpy as np
import datetime
from state_machine import StateMachine
import state_check
import subprocess
import sys

# Load the trained SOM model and scaler
som = joblib.load('som_model.joblib')
scaler1 = joblib.load('scaler.joblib')

# Create an instance of the Prediction class
prediction_instance = Prediction(som, scaler1)
new_data = data_struct.to_pred

predicted_cluster = prediction_instance.predict_cluster(new_data)
print(f"Predicted Cluster: {predicted_cluster}")

data_struct.pred_cluster = predicted_cluster

if __name__ == "__main__":
    # Create a StateMachine instance
    machine = state_machine.StateMachine()

    # Perform actions based on the current state
    x = machine.perform_action()  # Output: Performing normal action

    # Change the state of the state machine
    machine.change_state(state_machine.Cloudy())

    # Perform actions based on the new state
    machine.perform_action()  # Output: Performing cloudy action

    # Change the state again
    machine.change_state(state_machine.Fault())

    # Perform actions based on the new state
    machine.perform_action()  # Output: Performing fault action
    
    # Change the state again
    machine.change_state(state_machine.Shading())

    # Perform actions based on the new state
    machine.perform_action()  # Output: Performing shading action

    # You can integrate other functions here as needed

# Run the cleaning.py script
row_data = (data_struct.lst_row[0], data_struct.lst_row[1], data_struct.lst_row[2], data_struct.pred_cluster, x)  # Specify the values for each column

db_connection.save_row_to_database(row_data)
print(predicted_cluster)
print(x)

    # # Check if scipy is installed
    # try:
    #     import scipy
    # except ImportError:
    #     print("scipy is not installed. Installing now...")
    #     subprocess.check_call([sys.executable, "-m", "pip", "install", "scipy"])

    # try:
    #     result = subprocess.run(["python", "cleaning.py"], check=True, capture_output=True, text=True)
    #     print("cleaning.py executed successfully")
    #     print("Standard Output:", result.stdout)
    #     print("Standard Error:", result.stderr)
    # except subprocess.CalledProcessError as e:
    #     print(f"Error occurred while executing cleaning.py: {e}")
    #     print("Standard Output:", e.stdout)
    #     print("Standard Error:", e.stderr)
