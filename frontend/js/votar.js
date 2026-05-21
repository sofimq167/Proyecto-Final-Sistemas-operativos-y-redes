document.getElementById('form-voto').addEventListener('submit', async function (e) {
    e.preventDefault();

    const codigo = document.getElementById('codigo').value.trim();
    const seleccionado = document.querySelector('input[name="candidato"]:checked');

    if (!seleccionado) {
        mostrarAlerta('Selecciona un candidato antes de votar.', 'warning');
        return;
    }

    const candidato_id = parseInt(seleccionado.value);

    try {
        const respuesta = await fetch('/api/votar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ codigo, candidato_id })
        });

        const datos = await respuesta.json();

        if (datos.exito) {
            mostrarAlerta(datos.mensaje, 'success');
            document.getElementById('form-voto').reset();
            limpiarSeleccion();
        } else {
            mostrarAlerta(datos.mensaje, 'danger');
        }

    } catch (error) {
        mostrarAlerta('No se pudo conectar con el servidor. Intentá de nuevo.', 'danger');
    }
});

function mostrarAlerta(mensaje, tipo) {
    const alerta = document.getElementById('alerta');
    alerta.textContent = mensaje;
    alerta.className = `alerta-custom alert alert-${tipo}`;
}

function limpiarSeleccion() {
    document.querySelectorAll('.tarjeta-candidato').forEach(t => t.classList.remove('seleccionada'));
}

document.querySelectorAll('input[name="candidato"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
        limpiarSeleccion();
        this.closest('.tarjeta-candidato').classList.add('seleccionada');
    });
});
