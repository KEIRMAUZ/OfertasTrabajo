const fs = require('fs');
const XLSX = require('xlsx');

function convertirXlsx(data) {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Ofertas");

        XLSX.writeFile(workbook, 'resultados.xlsx');
        
    } catch (err) {
        
    }
}

module.exports = convertirXlsx;
