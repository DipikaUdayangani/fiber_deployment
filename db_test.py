import pymysql

conn = pymysql.connect(
    host='localhost',
    user='root',
    password='Dipi2002#',
    database='fiber_development'
)

print("Connected successfully!")
conn.close()
