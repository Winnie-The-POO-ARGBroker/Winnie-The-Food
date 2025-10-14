from django.db import connections
from django.db.utils import OperationalError

def check_database_connection():
    db_conn = connections['default']
    try:
        db_conn.cursor()
        print("✅ Conexión exitosa a la base de datos.")
    except OperationalError as e:
        print("❌ Error de conexión a la base de datos:", e)

if __name__ == "__main__":
    check_database_connection()
