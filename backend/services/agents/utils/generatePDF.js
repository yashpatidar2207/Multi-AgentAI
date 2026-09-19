import PDFDocument from "pdfkit";
import {
  renderTitle,
  renderSubtitle,
  renderHeading,
  renderBullet,
  checkPageBreak,
} from "./PDFHelper.js";


const generatePDF = async (data) => {
  return new Promise((resolve, reject) => {

    const doc = new PDFDocument({
      size: "A4",

      margins: {
        top: 50,
        bottom: 50,
        left: 50,
        right: 50,
      },

      bufferPages: true,

      info: {
        Title: data?.title || "Generated PDF",
        Author: "MultiAI",
        Creator: "MultiAI PDF Agent",
      },
    });

    const chunks = [];


    // --------------------------------
    // PDF Data Chunks
    // --------------------------------

    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });


    // --------------------------------
    // PDF Generation Completed
    // --------------------------------

    doc.on("end", () => {
      const pdfBuffer = Buffer.concat(chunks);

      resolve(pdfBuffer);
    });


    // --------------------------------
    // PDF Generation Error
    // --------------------------------

    doc.on("error", (error) => {
      reject(error);
    });


    // --------------------------------
    // New Page Created
    // --------------------------------

    doc.on("pageAdded", () => {
      console.log("New PDF page added");
    });


    // --------------------------------
    // Render PDF Content
    // --------------------------------

    renderTitle(doc, data?.title);

    renderSubtitle(doc, data?.subtitle);


    data?.sections?.forEach((section) => {

      // Prevent heading from appearing
      // too close to the bottom
      checkPageBreak(doc, 80);

      renderHeading(doc, section?.heading);


      section?.points?.forEach((point) => {

        // Check available space
        // before rendering bullet
        checkPageBreak(doc, 40);

        renderBullet(doc, point);

      });


      // Space after each section
      doc.moveDown(0.8);
    });


    // --------------------------------
    // Finish PDF
    // --------------------------------

    doc.end();
  });
};


export default generatePDF;