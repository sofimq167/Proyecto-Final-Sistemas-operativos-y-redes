from flask import Blueprint, request, jsonify
import psycopg2
from database import obtener_conexion

votar_bp = Blueprint('votar', __name__)

@votar_bp.route('/votar', methods=['POST'])
def votar():
    datos = request.get_json()

    if not datos:
        return jsonify({'exito': False, 'mensaje': 'Se esperaba un JSON'}), 400

    codigo = str(datos.get('codigo', '')).strip()
    candidato_id = datos.get('candidato_id')

    if not codigo or candidato_id is None:
        return jsonify({'exito': False, 'mensaje': 'Faltan campos: codigo y candidato_id'}), 400

    conn = None
    try:
        conn = obtener_conexion()
        cur = conn.cursor()
        cur.execute(
            'INSERT INTO votos (codigo, candidato_id) VALUES (%s, %s)',
            (codigo, candidato_id)
        )
        conn.commit()
        cur.close()
        return jsonify({'exito': True, 'mensaje': '¡Voto registrado!'})

    except psycopg2.errors.UniqueViolation:
        # La BD rechaza el INSERT porque el codigo ya existe como PRIMARY KEY.
        # No necesitamos consultarla antes — dejamos que la restricción haga el trabajo.
        return jsonify({'exito': False, 'mensaje': 'Este código ya emitió su voto'}), 409

    except psycopg2.errors.ForeignKeyViolation:
        return jsonify({'exito': False, 'mensaje': 'El candidato seleccionado no existe'}), 400

    except Exception:
        return jsonify({'exito': False, 'mensaje': 'Error interno del servidor'}), 500

    finally:
        # Cerramos siempre, incluso si hubo excepción
        if conn:
            conn.close()
