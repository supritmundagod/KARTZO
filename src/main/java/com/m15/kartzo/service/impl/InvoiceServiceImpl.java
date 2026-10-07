package com.m15.kartzo.service.impl;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Service;

import com.itextpdf.text.BaseColor;
import com.itextpdf.text.Chunk;
import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.m15.kartzo.entity.Order;
import com.m15.kartzo.entity.OrderItem;
import com.m15.kartzo.service.InvoiceService;

@Service
public class InvoiceServiceImpl implements InvoiceService {

    @Override
    public byte[] generateInvoice(Order order) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document();
        PdfWriter.getInstance(document, out);
        document.open();

        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 24, BaseColor.BLACK);
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 11, BaseColor.BLACK);
        Font tableHeaderFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, BaseColor.WHITE);

        // Header Table (Logo/Title and Details)
        PdfPTable headerTable = new PdfPTable(2);
        headerTable.setWidthPercentage(100);
        headerTable.setWidths(new float[]{1, 1});

        PdfPCell titleCell = new PdfPCell(new Phrase("KARTZO", titleFont));
        titleCell.setBorder(PdfPCell.NO_BORDER);
        titleCell.setHorizontalAlignment(Element.ALIGN_LEFT);
        headerTable.addCell(titleCell);

        PdfPCell invoiceLabelCell = new PdfPCell(new Phrase("INVOICE", headerFont));
        invoiceLabelCell.setBorder(PdfPCell.NO_BORDER);
        invoiceLabelCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        headerTable.addCell(invoiceLabelCell);

        document.add(headerTable);
        document.add(new Paragraph("\n"));

        // Company Details & Order Details
        PdfPTable infoTable = new PdfPTable(2);
        infoTable.setWidthPercentage(100);
        
        PdfPCell companyCell = new PdfPCell();
        companyCell.setBorder(PdfPCell.NO_BORDER);
        companyCell.addElement(new Phrase("Kartzo E-commerce", headerFont));
        companyCell.addElement(new Phrase("123 Tech Park, Innovation Drive", normalFont));
        companyCell.addElement(new Phrase("contact@kartzo.com", normalFont));
        infoTable.addCell(companyCell);

        PdfPCell orderDetailsCell = new PdfPCell();
        orderDetailsCell.setBorder(PdfPCell.NO_BORDER);
        orderDetailsCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        
        Paragraph p1 = new Paragraph();
        p1.add(new Chunk("Order ID: ", headerFont));
        p1.add(new Chunk("#" + order.getId(), normalFont));
        orderDetailsCell.addElement(p1);
        
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm");
        Paragraph p2 = new Paragraph();
        p2.add(new Chunk("Date: ", headerFont));
        p2.add(new Chunk(order.getOrderDate().format(formatter), normalFont));
        orderDetailsCell.addElement(p2);
        
        infoTable.addCell(orderDetailsCell);

        document.add(infoTable);
        document.add(new Paragraph("\n"));

        // Customer Details
        Paragraph customerInfo = new Paragraph();
        customerInfo.add(new Chunk("Billed To:\n", headerFont));
        customerInfo.add(new Chunk(order.getUser().getName() + "\n", normalFont));
        customerInfo.add(new Chunk(order.getUser().getEmail() + "\n", normalFont));
        customerInfo.add(new Chunk(order.getUser().getMobile() + "\n", normalFont));
        customerInfo.add(new Chunk(order.getDeliveryAddress() + "\n", normalFont));
        document.add(customerInfo);
        document.add(new Paragraph("\n"));

        // Items Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3, 1, 1, 1});

        BaseColor primaryColor = new BaseColor(79, 70, 229); // #4F46E5

        PdfPCell h1 = new PdfPCell(new Phrase("Product", tableHeaderFont));
        h1.setBackgroundColor(primaryColor);
        h1.setPadding(8);
        table.addCell(h1);

        PdfPCell h2 = new PdfPCell(new Phrase("Price", tableHeaderFont));
        h2.setBackgroundColor(primaryColor);
        h2.setPadding(8);
        table.addCell(h2);

        PdfPCell h3 = new PdfPCell(new Phrase("Qty", tableHeaderFont));
        h3.setBackgroundColor(primaryColor);
        h3.setPadding(8);
        table.addCell(h3);

        PdfPCell h4 = new PdfPCell(new Phrase("Total", tableHeaderFont));
        h4.setBackgroundColor(primaryColor);
        h4.setPadding(8);
        table.addCell(h4);

        for (OrderItem item : order.getOrderItems()) {
            PdfPCell c1 = new PdfPCell(new Phrase(item.getProduct().getName(), normalFont));
            c1.setPadding(8);
            table.addCell(c1);

            PdfPCell c2 = new PdfPCell(new Phrase("Rs. " + String.format("%.2f", item.getPrice()), normalFont));
            c2.setPadding(8);
            table.addCell(c2);

            PdfPCell c3 = new PdfPCell(new Phrase(String.valueOf(item.getQuantity()), normalFont));
            c3.setPadding(8);
            table.addCell(c3);

            PdfPCell c4 = new PdfPCell(new Phrase("Rs. " + String.format("%.2f", item.getPrice() * item.getQuantity()), normalFont));
            c4.setPadding(8);
            table.addCell(c4);
        }

        document.add(table);
        document.add(new Paragraph("\n"));

        // Totals
        PdfPTable totalTable = new PdfPTable(2);
        totalTable.setWidthPercentage(100);
        totalTable.setWidths(new float[]{3, 1});

        PdfPCell emptyCell = new PdfPCell(new Phrase(""));
        emptyCell.setBorder(PdfPCell.NO_BORDER);

        // Subtotal (Wait, order doesn't store subtotal, but it stores totalAmount. If we want discount, we could calculate it or just show final total.)
        // Since we didn't store discount amount in Order table, we'll just show the final Total.
        totalTable.addCell(emptyCell);
        PdfPCell totalCell = new PdfPCell(new Phrase("Total Amount: Rs. " + String.format("%.2f", order.getTotalAmount()), headerFont));
        totalCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        totalCell.setBorder(PdfPCell.NO_BORDER);
        totalCell.setPaddingTop(10);
        totalTable.addCell(totalCell);

        document.add(totalTable);

        // Footer
        document.add(new Paragraph("\n\n"));
        Paragraph footer = new Paragraph("Thank you for shopping with Kartzo!", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, BaseColor.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }
}
