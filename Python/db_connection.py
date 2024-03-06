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
            SELECT Time, `Power(W)`, `Temperature(℃)`
            FROM base_hospital_mahiyanganaya_ggu
            ORDER BY Time DESC
            LIMIT 1
        """)

        # Fetch the last row data
        last_row_data = cursor.fetchone()

        # Print the last row data
        if last_row_data:
            print(last_row_data)
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
        
        row_data = tuple(convert_to_python_type(value) for value in row_data)

        # Prepare the SQL query to insert the row into the table
        insert_query = """
            INSERT INTO output (Time, `Power(W)`, `Temperature(℃)`, cluster, Status) 
            VALUES (%s, %s, %s,%s,%s)
        """

        # Execute the SQL query with the row data
        cursor.execute(insert_query, row_data)

        # Commit the transaction to save the changes
        connection.commit()

        print("Row inserted successfully.")

    except mysql.connector.Error as error:
        print("Error inserting row into the database:", error)
        