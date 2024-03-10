import mysql.connector
import numpy as np

def connect_to_database():
    try:
        # Establish a connection to the MySQL database
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

        # Create a cursor object to interact with the database
        cursor = connection.cursor()

        # Execute the SQL query to fetch data from the table
        cursor.execute("""
            SELECT last_refresh_time, pv_power, inner_tempperature
            FROM inverter_data
            ORDER BY last_refresh_time DESC
            LIMIT 1
        """)

        # Fetch the last row data
        last_row_data = cursor.fetchone()

        # Print the last row data
        if last_row_data:
            # print(last_row_data)
            return last_row_data
        else:
            print("No data found in the table")  

    except mysql.connector.Error as error:
        print("Error fetching data from MySQL table:", error)

def fetch_specific_row_data(condition):
    try:
        connection = connect_to_database()

        # Create a cursor object to interact with the database
        cursor = connection.cursor()

        # Execute a query to fetch data from the register_table
        query = "SELECT * FROM labled WHERE " + condition
        cursor.execute(query)
       # Fetch the first row that matches the condition
        rows = cursor.fetchall()
        
         # Iterate over all rows and keep track of the last one
        while rows is not None:
            return rows
          
    except mysql.connector.Error as error:
        print("Error fetching data from MySQL table:", error)
        
    
def fetch_last_n_rows(n,col_name):
    try:
        connection = connect_to_database()

        # Create a cursor object to interact with the database
        cursor = connection.cursor()

        # Execute a query to fetch the last 15 rows from the table
        cursor.execute("SELECT * FROM labled ORDER BY " +col_name+ " DESC LIMIT " + str(n))

        # Fetch all rows
        rows = cursor.fetchall()

        # Print or process the fetched rows
        power = []
        for row in rows:
            power.append(row)
            
        return power
        # # Close cursor and connection
        # cursor.close()
        # connection.close()

    except mysql.connector.Error as error:
        print("Error fetching data from MySQL table:", error)
    
def convert_to_python_type(value):
    if isinstance(value, np.int64):
        return int(value)  # Convert numpy.int64 to int
    else:
        return value    

def save_row_to_database(row_data):
    try:
        # Establish a connection to the database
        connection = connect_to_database()

        # Create a cursor object to interact with the database
        cursor = connection.cursor()

        # Convert row_data to a tuple of Python types
        row_data = tuple(convert_to_python_type(value) for value in row_data)

        # Get the id of the current row
        current_id = row_data[0]  # Assuming the first value in row_data is the id

        # Fetch the previous row from the database using the id
        previous_row_query = "SELECT * FROM output WHERE Time = %s"
        cursor.execute(previous_row_query, (current_id,))
        previous_row = cursor.fetchone()

        if previous_row:
            # Check if the other fields of the current row are different from the previous row
            if row_data[1:] != previous_row[1:]:
                # Prepare the SQL query to update the row in the table
                update_query = """
                    UPDATE output
                    SET Time = %s, `Power(W)` = %s, `Temperature(℃)` = %s, cluster = %s, Status = %s
                    WHERE Time = %s
                """

                # Execute the SQL query with the row data
                cursor.execute(update_query, row_data + (current_id,))

                # Commit the transaction to save the changes
                connection.commit()

                print("Row updated successfully.")
            else:
                print("Current data is equal to previous data. Skipping update.")
        else:
            # Insert the row into the table if the previous row doesn't exist
            insert_query = """
                INSERT INTO output (Time, `Power(W)`, `Temperature(℃)`, cluster, Status) 
                VALUES (%s, %s, %s, %s, %s)
            """

            # Execute the SQL query with the row data
            cursor.execute(insert_query, row_data)

            # Commit the transaction to save the changes
            connection.commit()

            print("Row inserted successfully.")

    except mysql.connector.Error as error:
        print("Error saving row to the database:", error)
