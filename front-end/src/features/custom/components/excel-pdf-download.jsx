import React from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { BsFiletypeXlsx } from "react-icons/bs";
import { FaFilePdf } from "react-icons/fa6";

const FileDownload = ({ fileData }) => {
  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(fileData.tabledata);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "UserLog");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "userLog.xlsx");
  };
  const downloadPdf = () => {
    const doc = new jsPDF();
    doc.text("userLogs", 10, 15);
    const tabledata = fileData.tabledata;
    autoTable(doc, {
      head: [fileData.tablehead],
      body: tabledata,
      startY: 20,
      margin: { left: 10 },
      theme: "grid", // gives proper borders
      headStyles: {
        fillColor: [41, 128, 185], // nice blue header
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      bodyStyles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
      },
      horizontalPageBreak: true,
      alternateRowStyles: {
        fillColor: [245, 245, 245], // zebra stripe effect
      },
      styles: {
        overflow: "linebreak", // wrap long text
        cellWidth: "wrap",
      },
      columnStyles: fileData.columnStyles,
    });
    doc.save("userLog.pdf");
  };
  return (
    <div className="flex pb-2 gap-2">
      <div className=" ml-1 flex items-center ">
        <FaFilePdf
          onClick={downloadPdf}
          className=" w-[20px] md:w-[30px] md:h-[35px] cursor-pointer transition-transform duration-150 active:scale-90"
        />
      </div>
      <div className="flex items-center">
        <BsFiletypeXlsx
          onClick={downloadExcel}
          className=" w-[20px] md:w-[30px] md:h-[35px] cursor-pointer transition-transform duration-150 active:scale-90"
        />
      </div>
    </div>
  );
};

export default FileDownload;
