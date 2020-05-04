import mysql.connector
import csv
from glob import glob
import pandas as pd

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  passwd="Vimmi@rani07",
  auth_plugin='mysql_native_password',
  database="app"
)

cursor = mydb.cursor()
a = [glob("csv/*.csv")]

query = "INSERT INTO user3 VALUES (%s, %s, %s, %s, %s)"

l = [i for ex in a for i in ex]

for i in l:
    csvfile = open(i)
    reader = csv.reader(csvfile)
    next(reader)
    for row in reader:
        cursor.execute(query,row)


#r = cursor.execute("Select count(*) from user3").fetchall()
#for x in r:
#    print(r)

#print(r)
#print(cursor.execute("Select count(*) from user3"))
mydb.commit()

mydb.close()


# CRON Statement
# 1 * * * * /opt/anaconda3/bin/python /Users/sashrikasurya/Documents/Visit/Project1/data_parser.py