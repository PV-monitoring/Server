import state_check
import data_struct
import output


import state_check
import data_struct
import output

class StateMachine:
    def __init__(self):
        # Initialize the state machine with the initial state
        self.state = Normal()

    def change_state(self, new_state):
        # Method to change the current state of the state machine
        self.state = new_state

    def perform_action(self):
        # Method to perform an action based on the current state
        action = self.state.perform_action(self)
        return action

class State:
    def perform_action(self, machine):
        # Abstract method to be implemented by concrete state classes
        pass

class Normal(State):
    def perform_action(self, machine):
        action = None
        if state_check.Prediction.under_perform_check(self,data_struct.pred_cluster, data_struct.under) == 0:
            machine.change_state(Normal())
            print("normal action")
            action = "normal"
        elif state_check.Prediction.normal_under_perform(self,data_struct.pred_cluster, data_struct.normal, data_struct.morning, data_struct.evening, data_struct.rt_hour) == 1:
            print("under normal action") 
            machine.change_state(Normal())
            action = "normal"
        elif state_check.Prediction.faulty_check(self,data_struct.faulty_flag) == 1:
            print("fault action") 
            machine.change_state(Fault())
            action = "fault"
        elif state_check.Prediction.shading_check(self,data_struct.pred_cluster, data_struct.pre_clusters) == 1:
            print("shading action") 
            machine.change_state(Shading())
            action = "shading"
        else:
            print("cloudy action") 
            machine.change_state(Cloudy())
            action = "cloudy"
            
        return action


class Cloudy(State):
    def perform_action(self, machine):
        action = None
        if state_check.Prediction.under_perform_check(self,data_struct.pred_cluster, data_struct.under) == 0:
            machine.change_state(Normal())
            print("normal action")
            action = "normal"
        elif state_check.Prediction.normal_under_perform(self,data_struct.pred_cluster, data_struct.normal, data_struct.morning, data_struct.evening, data_struct.rt_hour) == 1:
            print("under normal action") 
            machine.change_state(Normal())
            action = "normal"
        elif state_check.Prediction.faulty_check(self,data_struct.faulty_flag) == 1:
            print("fault action") 
            machine.change_state(Fault())
            action = "fault"
        elif state_check.Prediction.shading_check(self,data_struct.pred_cluster, data_struct.pre_clusters) == 1:
            print("shading action") 
            machine.change_state(Shading())
            action = "shading"
        else:
            print("cloudy action") 
            machine.change_state(Cloudy())
            action = "cloudy"
            
        return action


class Fault(State):
    def perform_action(self, machine):
        action = None
        if state_check.Prediction.under_perform_check(self,data_struct.pred_cluster, data_struct.under) == 0:
            machine.change_state(Normal())
            print("normal action")
            action = "normal"
        elif state_check.Prediction.normal_under_perform(self,data_struct.pred_cluster, data_struct.normal, data_struct.morning, data_struct.evening, data_struct.rt_hour) == 1:
            print("under normal action") 
            machine.change_state(Normal())
            action = "normal"
        elif state_check.Prediction.faulty_check(self,data_struct.faulty_flag) == 1:
            print("fault action") 
            machine.change_state(Fault())
            action = "fault"
        elif state_check.Prediction.shading_check(self,data_struct.pred_cluster, data_struct.pre_clusters) == 1:
            print("shading action") 
            machine.change_state(Shading())
            action = "shading"
        else:
            print("cloudy action") 
            machine.change_state(Cloudy())
            action = "cloudy"
            
        return action


class Shading(State):
    def perform_action(self, machine):
        action = None
        if state_check.Prediction.under_perform_check(self,data_struct.pred_cluster, data_struct.under) == 0:
            machine.change_state(Normal())
            print("normal action")
            action = "normal"
        elif state_check.Prediction.normal_under_perform(self,data_struct.pred_cluster, data_struct.normal, data_struct.morning, data_struct.evening, data_struct.rt_hour) == 1:
            print("under normal action") 
            machine.change_state(Normal())
            action = "normal"
        elif state_check.Prediction.faulty_check(self,data_struct.faulty_flag) == 1:
            print("fault action") 
            machine.change_state(Fault())
            action = "fault"
        elif state_check.Prediction.shading_check(self,data_struct.pred_cluster, data_struct.pre_clusters) == 1:
            print("shading action") 
            machine.change_state(Shading())
            action = "shading"
        else:
            print("cloudy action") 
            machine.change_state(Cloudy())
            action = "cloudy"
            
        return action


# Usage example













