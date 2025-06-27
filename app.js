const puppeteer = require('puppeteer');
const preguntarElemento = require('./preguntarElemento');

async function ofertasLaborales() {
    const navegador = await puppeteer.launch({
        headless: false,
        slowMo: 500
    });

    const pagina = await navegador.newPage();
    const elementoBuscar = await preguntarElemento();
    await pagina.goto(`https://hireline.io/remoto/empleos-de-${encodeURIComponent(elementoBuscar)}-en-latam`);

    let btnSiguientePagina = true;
    let AllPuestoTrabajo = [];

    while (btnSiguientePagina) {
        const datos = await pagina.evaluate(() => {
            const datosArreglo = [];
            const cards = document.querySelectorAll('a.hl-vacancy-card.vacancy-container');
        
            cards.forEach(card => {
                const URLPuesto = card.getAttribute('href');
                if (URLPuesto) {
                    datosArreglo.push({
                        URLPuesto: URLPuesto.startsWith('http') ? URLPuesto : 'https://hireline.io/' + URLPuesto
                    });
                }
            });
        
            return datosArreglo;
        });

        AllPuestoTrabajo = [...AllPuestoTrabajo, ...datos];

        btnSiguientePagina = await pagina.evaluate(() => {
            return !!document.querySelector('a.mt-4.md\\:mt-0.transition-all.hover\\:underline');
        });

        if (btnSiguientePagina) {
            const btnSiguiente = await pagina.$('a.mt-4.md\\:mt-0.transition-all.hover\\:underline');
            if (btnSiguiente) {
                await btnSiguiente.click();
                await pagina.waitForSelector('a.hl-vacancy-card.vacancy-container', { timeout: 10000 });
            } else {
                btnSiguientePagina = false;
            }
        }
    }

    for (const puesto of AllPuestoTrabajo) {
        const url = puesto.URLPuesto;
        const paginaPuesto = await navegador.newPage();
        await paginaPuesto.goto(url);

        const datosPuesto = await paginaPuesto.evaluate(() => {
            const titulo = document.querySelector('h1.text-cornflower-blue.text-2xl.font-bold.font-outfit')?.innerText;
            return { titulo };
        });

        puesto.titulo = datosPuesto.titulo;
        await paginaPuesto.close();
    }

    await navegador.close();

    console.log("Resultados obtenidos:", AllPuestoTrabajo);
}

// ✅ Llamada a la función para iniciar el proceso
ofertasLaborales();
