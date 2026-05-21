from .votar import votar_bp
from .resultados import resultados_bp

def registrar_rutas(app):
    # Para agregar un endpoint nuevo basta con crear su blueprint
    # y registrarlo acá — app.py no se toca
    app.register_blueprint(votar_bp)
    app.register_blueprint(resultados_bp)
