from flask import Blueprint, jsonify
from database import obtener_conexion

resultados_bp = Blueprint('resultados', __name__)

@resultados_bp.route('/resultados', methods=['GET'])
def resultados():
    conn = None
    try:
        conn = obtener_conexion()
        cur = conn.cursor()

        # LEFT JOIN para que aparezcan candidatos con 0 votos también
        cur.execute('''
            SELECT c.id, c.nombre, COUNT(v.codigo) AS votos
            FROM candidatos c
            LEFT JOIN votos v ON c.id = v.candidato_id
            GROUP BY c.id, c.nombre
            ORDER BY c.id
        ''')

        filas = cur.fetchall()
        cur.close()

        resultado = [
            {'id': fila[0], 'candidato': fila[1], 'votos': fila[2]}
            for fila in filas
        ]
        return jsonify(resultado)

    except Exception:
        return jsonify({'exito': False, 'mensaje': 'Error interno del servidor'}), 500

    finally:
        if conn:
            conn.close()
