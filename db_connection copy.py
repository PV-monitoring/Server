import mysql.connector
import numpy as np
import datetime

def connect_to_database():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="pv_monitoring"
        )

        if connection.is_connected():
            print('Connected successfully')
            return connection
        else:
            print('Failed to connect')
            return None

    except mysql.connector.Error as error:
        print("Error connecting to MySQL:", error)
        return None


def fetch_lastrow_data():
    try:
        connection = connect_to_database()
        cursor = connection.cursor()
        cursor.execute("""
            SELECT last_refresh_time, pv_power, inner_tempperature
            FROM inverter_data
            ORDER BY last_refresh_time DESC
            LIMIT 1
        """)

        last_row_data = cursor.fetchone()

        if last_row_data:
            return last_row_data
        else:
            print("No data found in the table")  

    except mysql.connector.Error as error:
        print("Error fetching data from MySQL table:", error)

def fetch_specific_row_data(condition):
    try:
        connection = connect_to_database()
        cursor = connection.cursor()
        query = "SELECT * FROM labled WHERE " + condition
        cursor.execute(query)
        rows = cursor.fetchall()
        
        while rows is not None:
            return rows
          
    except mysql.connector.Error as error:
        print("Error fetching data from MySQL table:", error)
        
    
def fetch_last_n_rows(n, col_name):
    try:
        connection = connect_to_database()
        cursor = connection.cursor()
        cursor.execute("SELECT * FROM labled ORDER BY " + col_name + " DESC LIMIT " + str(n))
        rows = cursor.fetchall()
        power = [row for row in rows]
        return power

    except mysql.connector.Error as error:
        print("Error fetching data from MySQL table:", error)
    
def convert_to_python_type(value):
    if isinstance(value, np.int64):
        return int(value)
    else:
        return value    

def save_row_to_database(row_data):
    try:
        connection = connect_to_database()
        cursor = connection.cursor()
        row_data = tuple(convert_to_python_type(value) for value in row_data)
        current_id = row_data[0]
        previous_row_query = "SELECT * FROM output WHERE Time = %s"
        cursor.execute(previous_row_query, (current_id,))
        previous_row = cursor.fetchone()

        if previous_row:
            if row_data[1:] != previous_row[1:]:
                update_query = """
                    UPDATE output
                    SET Time = %s, `Power(W)` = %s, `Temperature(℃)` = %s, cluster = %s, Status = %s
                    WHERE Time = %s
                """
                cursor.execute(update_query, row_data + (current_id,))
                connection.commit()
                print("Row updated successfully.")
            else:
                print("Current data is equal to previous data. Skipping update.")
        else:
            insert_query = """
                INSERT INTO output (Time, `Power(W)`, `Temperature(℃)`, cluster, Status) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cursor.execute(insert_query, row_data)
            connection.commit()
            print("Row inserted successfully.")

    except mysql.connector.Error as error:
        print("Error saving row to the database:", error)

def get_average_power_for_date(date, cursor):
    formatted_date = date.strftime('%Y-%m-%d')
    query = """
    SELECT pv_power 
    FROM inverter_data 
    WHERE DATE(last_refresh_time) = %s
    """
    cursor.execute(query, (formatted_date,))
    power_values = cursor.fetchall()
    
    if power_values:
        average_power = sum(value[0] for value in power_values) / len(power_values)
    else:
        average_power = None
    
    return average_power




