const fs = require('fs');

function exportarJSON(data) {
    fs.writeFileSync('resultados.json', JSON.stringify(data, null, 2), 'utf8');
    
}

module.exports = exportarJSON;
