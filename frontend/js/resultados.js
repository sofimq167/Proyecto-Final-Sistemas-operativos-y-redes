async function cargarResultados() {
    try {
        const respuesta = await fetch('/api/resultados');
        const datos = await respuesta.json();

        const totalVotos = datos.reduce((suma, item) => suma + item.votos, 0);
        const maxVotos = Math.max(...datos.map(item => item.votos));

        const contenedor = document.getElementById('contenedor-resultados');
        contenedor.innerHTML = '';

        datos.forEach(function (item) {
            const porcentaje = totalVotos > 0 ? Math.round((item.votos / totalVotos) * 100) : 0;
            const esLider = item.votos === maxVotos && maxVotos > 0;

            const fila = document.createElement('div');
            fila.className = 'candidato-row' + (esLider ? ' lider' : '');
            fila.innerHTML = `
                <div class="fila-info">
                    <span class="nombre-res">${item.candidato}${esLider ? ' 🏆' : ''}</span>
                    <span class="conteo-res">${item.votos} voto${item.votos !== 1 ? 's' : ''} · ${porcentaje}%</span>
                </div>
                <div class="barra-container">
                    <div class="barra-fill" style="width: ${porcentaje}%"></div>
                </div>
            `;
            contenedor.appendChild(fila);
        });

        if (totalVotos > 0) {
            const total = document.createElement('p');
            total.className = 'total-votos';
            total.textContent = `Total de votos: ${totalVotos}`;
            contenedor.appendChild(total);
        }

        document.getElementById('error').classList.add('d-none');

    } catch (error) {
        const err = document.getElementById('error');
        err.textContent = 'No se pudieron cargar los resultados.';
        err.classList.remove('d-none');
    }
}

cargarResultados();
setInterval(cargarResultados, 5000);
