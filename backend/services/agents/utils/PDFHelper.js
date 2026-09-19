// utils/pdfHelpers.js

export const renderTitle = (doc, title) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(24)
    .fillColor("#111827")
    .text(title, {
      align: "center",
      lineGap: 5,
    });

  doc.moveDown(0.8);
};


export const renderSubtitle = (doc, subtitle) => {
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#6B7280")
    .text(subtitle, {
      align: "center",
      lineGap: 4,
    });

  doc.moveDown(1.5);
};


export const renderHeading = (doc, heading) => {
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .fillColor("#111827")
    .text(heading, {
      lineGap: 4,
    });

  doc.moveDown(0.5);
};


export const renderBullet = (doc, point) => {
  doc
    .font("Helvetica")
    .fontSize(11)
    .fillColor("#374151")
    .text(`• ${point}`, {
      indent: 15,
      width: doc.page.width - 100,
      lineGap: 5,
    });

  doc.moveDown(0.3);
};


export const checkPageBreak = (doc, requiredSpace = 80) => {
  const bottomMargin = doc.page.margins.bottom;
  const pageHeight = doc.page.height;

  const availableHeight = pageHeight - bottomMargin;

  if (doc.y + requiredSpace > availableHeight) {
    doc.addPage();
    return true;
  }

  return false;
};