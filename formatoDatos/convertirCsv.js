const fs = require('fs');
const { Parser } = require('json2csv');

function exportarCSV(data) {
    const fields = ['titulo', 'sueldo', 'ubicacion', 'tiempo', 'ingles', 'descripcionLimpia', 'URLPuesto'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    fs.writeFileSync('resultados.csv', csv, 'utf8');
    
}

module.exports = exportarCSV;
