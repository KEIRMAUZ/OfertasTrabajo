import puppeteer from "puppeteer";
import preguntarElemento from './preguntarElemento'

export async function ofertasLaborales(){
    const navegador = await puppeteer.launch({
        headless: false,
        slowMo: 500
    });

    const pagina = await navegador.newPage();
    const elementoBuscar = await preguntarElemento();
    await pagina.goto(`https://hireline.io/remoto/empleos-de-${encodeURIComponent(elementoBuscar)}-en-latam`);

    let btnSiguientePagina = true;
    let AllPuestoTrabajo = []

    while(btnSiguientePagina){
        const datos = await pagina.evaluate(()=>{
            const datosArreglo=[]
            const contenedorCards = document.querySelectorAll('div.w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mt-6 md:mt-12');

            contenedorCards.forEach(card=>{
                const URLArticulo = card.querySelector('a.hl-vacancy-card vacancy-container')?.getAttribute('href');

                if(URLArticulo){
                    datosArreglo.push({
                        URLArticulo:URLArticulo
                    })
                }
            });//FOR EACH
            return datosArreglo;
        });

        AllPuestoTrabajo=[...AllPuestoTrabajo,...datos];

        btnSiguientePagina=await pagina.evaluate(()=>{
            const btnSiguiente = document.querySelector('a.mt-4 md:mt-0 transition-all hover:underline');
            return btnSiguiente ?true:false;
        });

        if(btnSiguientePagina){
            const btnSiguiente = await pagina.$('a.mt-4 md:mt-0 transition-all hover:underline');
            await btnSiguiente.click();
            await pagina.waitForNavigation({
                waitUntil:'networkidle0'
            });
            
        }else{
            btnSiguientePagina=false;
        }
    }//WHILE


    for (const puesto of AllPuestoTrabajo){
        
    }
}