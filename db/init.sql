-- Este script corre solo una vez cuando el contenedor de PostgreSQL
-- se crea por primera vez. Si el volumen ya existe, no vuelve a correr.

CREATE TABLE candidatos (
    id   SERIAL      PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Usamos codigo como PRIMARY KEY en vez de solo UNIQUE:
-- PRIMARY KEY ya implica UNIQUE + NOT NULL, y es más claro sobre el rol de esa columna
CREATE TABLE votos (
    codigo       VARCHAR(20) PRIMARY KEY,
    candidato_id INT         NOT NULL REFERENCES candidatos(id),
    timestamp    TIMESTAMPTZ DEFAULT NOW()
);

-- Candidatos a mascota de la Facultad de Ingeniería USB Cali
INSERT INTO candidatos (nombre) VALUES
    ('Pavo Real'),
    ('Pato'),
    ('Ganso');
