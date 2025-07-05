const fs = require('fs');
const PDFDocument = require('pdfkit');

function convertirPdf(data) {
    try {
        const doc = new PDFDocument({ 
            margin: 40, 
            size: 'A4',
            info: {
                Title: 'Ofertas Laborales - Hireline',
                Author: 'Sistema de Búsqueda de Empleos',
                Subject: 'Ofertas de Trabajo Remoto en LATAM',
                Keywords: 'empleos, trabajo remoto, latam, hireline',
                CreationDate: new Date()
            }
        });
        
        const writeStream = fs.createWriteStream('resultados.pdf');
        doc.pipe(writeStream);

        let currentPage = 1;

        // Function to add footer to current page
        const addFooter = () => {
            const currentY = doc.y;
            
            // Footer line
            doc.strokeColor('#d1d5db')
               .lineWidth(0.5)
               .moveTo(40, doc.page.height - 60)
               .lineTo(doc.page.width - 40, doc.page.height - 60)
               .stroke();
            
            // Page number
            doc.fontSize(8)
               .fillColor('#9ca3af')
               .font('Helvetica')
               .text(`Pagina ${currentPage}`, 40, doc.page.height - 50, { align: 'center' });
            
            // Footer text
            doc.fontSize(8)
               .fillColor('#9ca3af')
               .text('Generado automaticamente por Sistema de Busqueda de Empleos', 40, doc.page.height - 35, { align: 'center' });
            
            // Reset position
            doc.y = currentY;
        };

        // Header with gradient-like effect
        doc.rect(0, 0, doc.page.width, 80)
           .fill('#1e40af');
        
        doc.fontSize(24)
           .fillColor('white')
           .font('Helvetica-Bold')
           .text('Ofertas Laborales', 40, 20, { align: 'center' });
        
        doc.fontSize(14)
           .fillColor('#e0e7ff')
           .font('Helvetica')
           .text('Hireline - Empleos Remotos en LATAM', 40, 50, { align: 'center' });
        
        doc.fontSize(10)
           .fillColor('#94a3b8')
           .text(`Generado el ${new Date().toLocaleDateString('es-ES', { 
               year: 'numeric', 
               month: 'long', 
               day: 'numeric',
               hour: '2-digit',
               minute: '2-digit'
           })}`, 40, 70, { align: 'center' });

        // Reset position for content
        doc.moveDown(4);

        // Summary section
        doc.fontSize(12)
           .fillColor('#374151')
           .font('Helvetica-Bold')
           .text(`Total de ofertas encontradas: ${data.length}`, { underline: true });
        
        doc.moveDown(0.5);

        // Process each job offer
        data.forEach((oferta, index) => {
            // Check if we need a new page
            if (doc.y > doc.page.height - 200) {
                // Add footer to current page before adding new one
                addFooter();
                
                // Add new page
                doc.addPage();
                currentPage++;
            }

            // Job offer container
            const startY = doc.y;
            
            // Background for job offer
            doc.rect(0, startY - 10, doc.page.width, 0)
               .fill('#f8fafc');
            
            // Job number and title
            doc.fontSize(16)
               .fillColor('#1e40af')
               .font('Helvetica-Bold')
               .text(`${index + 1}. ${oferta.titulo || 'Sin titulo'}`, { underline: true });
            
            doc.moveDown(0.3);

            // Job details in a structured format
            const details = [];
            if (oferta.sueldo) details.push({ label: 'SALARIO', value: oferta.sueldo });
            if (oferta.ubicacionLimpia) details.push({ label: 'UBICACION', value: oferta.ubicacionLimpia });
            if (oferta.tiempo) details.push({ label: 'TIPO DE CONTRATO', value: oferta.tiempo });
            if (oferta.ingles) details.push({ label: 'INGLES REQUERIDO', value: oferta.ingles });

            // Display details in columns
            details.forEach((detail, i) => {
                doc.fontSize(10)
                   .fillColor('#6b7280')
                   .font('Helvetica-Bold')
                   .text(detail.label, { continued: true });
                
                doc.fontSize(10)
                   .fillColor('#374151')
                   .font('Helvetica')
                   .text(`: ${detail.value}`);
            });

            doc.moveDown(0.5);

            // Description section
            if (oferta.descripcionLimpia) {
                doc.fontSize(11)
                   .fillColor('#1f2937')
                   .font('Helvetica-Bold')
                   .text('DESCRIPCION DEL PUESTO:');
                
                doc.moveDown(0.2);
                
                // Format description with proper wrapping using text method
                const maxWidth = doc.page.width - 80;
                const description = oferta.descripcionLimpia;
                
                // Split description into chunks to avoid very long descriptions
                const maxChars = 800; // Limit characters to keep PDF manageable
                const truncatedDescription = description.length > maxChars 
                    ? description.substring(0, maxChars) + '...'
                    : description;
                
                doc.fontSize(9)
                   .fillColor('#4b5563')
                   .font('Helvetica')
                   .text(truncatedDescription, { 
                       indent: 15,
                       width: maxWidth,
                       align: 'justify'
                   });
                
                if (description.length > maxChars) {
                    doc.fontSize(8)
                       .fillColor('#9ca3af')
                       .text(`(Descripcion truncada - ${description.length - maxChars} caracteres mas disponibles)`, { 
                           indent: 15 
                       });
                }
            }

            doc.moveDown(0.5);

            // URL section
            doc.fontSize(9)
               .fillColor('#3b82f6')
               .font('Helvetica-Bold')
               .text('VER OFERTA COMPLETA:', { continued: true });
            
            doc.fontSize(9)
               .fillColor('#3b82f6')
               .font('Helvetica')
               .text(` ${oferta.URLPuesto}`, { 
                   link: oferta.URLPuesto, 
                   underline: true 
               });

            // Separator line
            doc.moveDown(0.5);
            doc.strokeColor('#e5e7eb')
               .lineWidth(1)
               .moveTo(40, doc.y)
               .lineTo(doc.page.width - 40, doc.y)
               .stroke();

            doc.moveDown(1);
        });

        // Add footer to the last page
        addFooter();

        doc.end();

        writeStream.on('finish', () => {
            console.log('✅ PDF generado exitosamente: resultados.pdf');
        });

        writeStream.on('error', (err) => {
            console.error('❌ Error al generar PDF:', err);
        });

    } catch (err) {
        console.error('❌ Error en la generacion del PDF:', err);
    }
}

module.exports = convertirPdf;
