const readline = require('readline');

function preguntarElemento() {
    return new Promise((resolve) => {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        function hacerPregunta() {
            rl.question("¿Qué empleo deseas buscar en Hireline? ", (respuesta) => {
                const argumentoBusqueda = respuesta.trim();
                if (argumentoBusqueda === '' || argumentoBusqueda.length < 3) {
                    console.log("Por favor, ingresa al menos 3 caracteres.");
                    hacerPregunta();
                } else {
                    rl.close();
                    resolve(argumentoBusqueda);
                }
            });
        }

        hacerPregunta();
    });
}

module.exports = preguntarElemento;
