from flask import Flask
from routes import registrar_rutas

app = Flask(__name__)
registrar_rutas(app)

if __name__ == '__main__':
    # debug=False porque en modo debug Flask lanza dos procesos,
    # y eso genera comportamiento raro dentro de un contenedor Docker
    app.run(host='0.0.0.0', port=5000, debug=False)
