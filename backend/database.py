import os
import psycopg2

def obtener_conexion():
    # Abre una conexión nueva por cada request.
    # Para el volumen de votos de esta elección alcanza y sobra.
    # Si escala a miles de requests simultáneos, habría que usar un pool.
    return psycopg2.connect(
        host=os.environ['DB_HOST'],
        port=os.environ['DB_PORT'],
        dbname=os.environ['DB_NAME'],
        user=os.environ['DB_USER'],
        password=os.environ['DB_PASSWORD']
    )
