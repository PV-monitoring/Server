import numpy as np

class Prediction:
    def __init__(self, som_model, scaler):
        self.som_model = som_model
        self.scaler = scaler

    def find_bmu(self, input_data):
        input_data = np.array(input_data).flatten()
        normalized_input = self.scaler.transform(input_data.reshape(1, -1))
        normalized_weights = self.som_model.get_weights() / np.linalg.norm(self.som_model.get_weights(), axis=-1, keepdims=True)
        distances = np.linalg.norm(normalized_weights - normalized_input, axis=-1)
        bmu_index = np.unravel_index(np.argmin(distances, axis=None), distances.shape)
        return bmu_index

    def predict_cluster(self, input_data):
        bmu_index = self.find_bmu(input_data)
        predicted_cluster = self.assign_cluster_label(bmu_index)
        return predicted_cluster

    # def visualize_som(self, input_data):
    #     bmu_index = self.find_bmu(input_data)
    #     # Visualize the SOM, highlighting the BMU
    #     # (Include your visualization code here)

    def assign_cluster_label(self, bmu_index):
        return bmu_index[0] * self.som_model._weights.shape[1] + bmu_index[1]






