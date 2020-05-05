import mysql.connector
import csv
from glob import glob
import pandas as pd

'''
Script to parse all csv files present in folder, 
Create table in database called user_all which stores all data from csv files.
'''

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="12345",
  auth_plugin='mysql_native_password',
  database="app"
)

cursor = mydb.cursor()

q1 = 'CREATE TABLE IF NOT EXISTS user_all (id int, name varchar(255), date bigint, steps int, calories int )'
cursor.execute(q1)
query1 = "INSERT IGNORE INTO user_all VALUES (%s, %s, %s, %s, %s)"

a = [glob("csv/*.csv")]
l = [i for ex in a for i in ex]

for i in l:
    csvfile = open(i)
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        cursor.execute(query1,row)
        

mydb.commit()
mydb.close()


# CRON Statement
# 1 * * * * /opt/anaconda3/bin/python /Users/sashrikasurya/Documents/Visit/Project1/data_parser.py