const fs = require('fs');
const PDFDocument = require('pdfkit');

function convertirPdf(data) {
    try {
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const writeStream = fs.createWriteStream('resultados.pdf');
        doc.pipe(writeStream);

        doc.fontSize(18).fillColor('blue').text('Ofertas Laborales - Hireline', { align: 'center' });
        doc.moveDown();

        data.forEach((oferta, index) => {
            doc
                .fontSize(12)
                .fillColor('black')
                .text(`${index + 1}. ${oferta.titulo || 'Sin título'}`, { underline: true });

            if (oferta.sueldo) doc.text(` Sueldo: ${oferta.sueldo}`);
            if (oferta.ubicacion) doc.text(` Ubicación: ${oferta.ubicacion}`);
            if (oferta.tiempo) doc.text(` Tiempo: ${oferta.tiempo}`);
            if (oferta.ingles) doc.text(`🇺🇸 Inglés: ${oferta.ingles}`);
            if (oferta.descripcionLimpia) {
                doc.text(` Descripción:`);
                doc.fontSize(10).text(oferta.descripcionLimpia, { indent: 10 });
            }

            doc.text(`URL: ${oferta.URLPuesto}`, { link: oferta.URLPuesto, underline: true });
            doc.moveDown().moveDown();
        });

        doc.end();

        writeStream.on('finish', () => {
           
        });

    } catch (err) {
        
    }
}

module.exports = convertirPdf;
