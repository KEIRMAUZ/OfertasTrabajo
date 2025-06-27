import readline from 'readline'
import resolve from 'path'

function preguntarElemento(){
    return new Promise((resolve)=>{
        const rl = readline.createInterface({
            input:process.stdin,
            output:process.stdout
        });
        function hacerPPregunta(){
            rl.question("Que empleo deseas buscar en Hireline?", (respuesta)=>{
                const argumentoBusqueda = respuesta.trim()
                if(argumentoBusqueda===''||argumentoBusqueda.length<3){
                    hacerPPregunta()
                }else{
                    rl.close()
                    resolve(argumentoBusqueda)
                }
            });
        }
        hacerPPregunta()
    });
}

module.exports = preguntarElemento;