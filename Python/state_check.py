class Prediction:
    def __init__(self, pred_cluster, time_range_m,time_range_e, date_time, pre_date_time, under,normal,rt_hour,pred_clusters,fault_flag):
        
        self.cluster = pred_cluster
        self.time_range_m = time_range_m
        self.time_range_e = time_range_e
        self.date_time = date_time
        self.pre_date_time = pre_date_time
        self.under = under
        self.normal = normal
        self.hour = rt_hour
        self.clusters = pred_clusters
        self.fault = fault_flag
        

    def under_perform_check(self, pred_cluster, under):
        if pred_cluster in under:
            under_perform = 1
        else:
            under_perform = 0

        return under_perform

    def normal_under_perform(self,pred_cluster, normal, time_range_m, time_range_e,rt_hour ):
        if pred_cluster in normal and ((time_range_e[0] <= rt_hour <= time_range_e[1] ) or (time_range_m[0] <= rt_hour <= time_range_m[1] ) ):
            normal_perform = 1
        else:
            normal_perform = 0

        return normal_perform
    
    def shading_check(self,pred_cluster,pred_clusters):
        shades = 0
        for dat in pred_clusters:
            if dat == pred_cluster:
                shades += 1 
            
        if shades >= 10:
            shades_index = 1
        else:
            shades_index = 0
        return shades_index
    
    # def cloudy_check(self, pred_irradiance, irradiance):
    #     if irradiance < pred_irradiance:
    #         cloudy_index = 1
    #     else:
    #         cloudy_index = 0

    #     return cloudy_index
    
    def faulty_check(self, fault_flag):
        if fault_flag == 1:
            faulty_index = 1
        else:
            faulty_index = 0 

        return faulty_index
    
    
