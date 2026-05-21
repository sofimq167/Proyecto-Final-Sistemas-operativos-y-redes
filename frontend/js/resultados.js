async function cargarResultados() {
    try {
        const respuesta = await fetch('/api/resultados');
        const datos = await respuesta.json();

        // Calculamos el total para mostrar el porcentaje de cada candidato
        const totalVotos = datos.reduce((suma, item) => suma + item.votos, 0);

        const contenedor = document.getElementById('contenedor-resultados');
        contenedor.innerHTML = '';

        datos.forEach(function (item) {
            const porcentaje = totalVotos > 0
                ? Math.round((item.votos / totalVotos) * 100)
                : 0;

            const bloque = document.createElement('div');
            bloque.className = 'mb-4';
            bloque.innerHTML = `
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-semibold">${item.candidato}</span>
                    <span>${item.votos} voto${item.votos !== 1 ? 's' : ''} (${porcentaje}%)</span>
                </div>
                <div class="progress">
                    <div class="progress-bar" style="width: ${porcentaje}%"></div>
                </div>
            `;
            contenedor.appendChild(bloque);
        });

        if (totalVotos > 0) {
            const total = document.createElement('p');
            total.className = 'text-muted text-end mt-3 mb-0';
            total.textContent = `Total de votos: ${totalVotos}`;
            contenedor.appendChild(total);
        }

        document.getElementById('error').classList.add('d-none');

    } catch (error) {
        document.getElementById('error').textContent = 'No se pudieron cargar los resultados.';
        document.getElementById('error').classList.remove('d-none');
    }
}

cargarResultados();

// Refresca automáticamente para mostrar los votos en tiempo real
setInterval(cargarResultados, 5000);
