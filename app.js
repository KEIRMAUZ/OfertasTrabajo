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
            const sueldo = document.querySelector('p.text-vivid-sky-blue.text-2xl.font-bold.font-outfit.mb-4')?.innerText;
            const ubicacion = document.querySelector('div>div:nth-child(1)>p:nth-child(2)')?.innerText;
            const tiempo = document.querySelector('div.flex.items-start.md\\:items-center.justify-start.flex-col.md\\:flex-row.gap-4')
            if(tiempo){
                const hijos = Array.from(tiempo.querySelectorAll('div'));
                const segundoDiv = hijos[1];
                tiempoTexto = segundoDiv?.querySelector('p')?.innerText?.trim() || '';
            }
            const ingles = document.querySelector('div.flex>div:nth-child(3)>p:nth-child(2).text-slate-gray.text-sm.font-medium:nth-child(2)')?.innerText;
            const descripcion = document.querySelector('div.text-sm.text-rich-black.font-normal.ul-disc.overflow-wrap')?.innerText;
            const descripcionLimpia = descripcion.replace(/\n+/g,' ').trim();

            return { 
                titulo,
                sueldo,
                ubicacion,
                tiempo:tiempoTexto,
                ingles,
                descripcionLimpia

            };
        });

        puesto.titulo = datosPuesto.titulo;
        puesto.sueldo = datosPuesto.sueldo;
        puesto.ubicacion = datosPuesto.ubicacion;
        puesto.tiempo = datosPuesto.tiempo;
        puesto.ingles = datosPuesto.ingles;
        puesto.descripcionLimpia=datosPuesto.descripcionLimpia;
        await paginaPuesto.close();
    }

    await navegador.close();

    console.log("Resultados obtenidos:", AllPuestoTrabajo);
}


ofertasLaborales();
