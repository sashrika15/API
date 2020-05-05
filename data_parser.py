import mysql.connector
import csv
from glob import glob
import pandas as pd

'''
Script to parse all csv files present in folder, 
Create table in database called users_all which stores all data from csv files.
'''

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="12345",
  auth_plugin='mysql_native_password',
  database="app"
)

cursor = mydb.cursor()
a = [glob("csv/*.csv")]

q1 = 'CREATE TABLE users_all (id int, name varchar(255), date bigint, steps int, calories int )'
cursor.execute(q1)

query = "INSERT IGNORE INTO users_all VALUES (%s, %s, %s, %s, %s)"

l = [i for ex in a for i in ex]

for i in l:
    csvfile = open(i)
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        cursor.execute(query,row)

mydb.commit()
mydb.close()


# CRON Statement
# 1 * * * * /opt/anaconda3/bin/python /Users/sashrikasurya/Documents/Visit/Project1/data_parser.py