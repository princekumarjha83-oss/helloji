import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Download, FileText, DollarSign, Package, MapPin, Calendar } from 'lucide-react'
import { Button } from './ui'

const PDFInvoice = ({ shipment, className = '' }) => {
  const generateInvoice = async () => {
    try {
      // Create a temporary div for the invoice
      const invoiceElement = document.createElement('div')
      invoiceElement.style.position = 'absolute'
      invoiceElement.style.left = '-9999px'
      invoiceElement.style.width = '210mm'
      invoiceElement.style.padding = '20mm'
      invoiceElement.style.fontFamily = 'Arial, sans-serif'
      invoiceElement.style.backgroundColor = 'white'
      
      invoiceElement.innerHTML = `
        <div style="border: 2px solid #3B82F6; padding: 20px; border-radius: 10px;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; border-bottom: 2px solid #E5E7EB; padding-bottom: 20px;">
            <div>
              <h1 style="color: #1F2937; font-size: 28px; font-weight: bold; margin: 0;">CourierLogix</h1>
              <p style="color: #6B7280; font-size: 14px; margin: 5px 0 0 0;">Professional Logistics Solutions</p>
              <p style="color: #6B7280; font-size: 12px; margin: 2px 0;">123 Logistics Street, City, State 12345</p>
              <p style="color: #6B7280; font-size: 12px; margin: 2px 0;">Phone: +1 (555) 123-4567 | Email: info@courierlogix.com</p>
            </div>
            <div style="text-align: right;">
              <h2 style="color: #3B82F6; font-size: 24px; font-weight: bold; margin: 0;">INVOICE</h2>
              <p style="color: #6B7280; font-size: 14px; margin: 5px 0 0 0;">Invoice #INV-${shipment.trackingId}</p>
              <p style="color: #6B7280; font-size: 12px; margin: 2px 0;">Date: ${new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <!-- Shipment Details -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1F2937; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #3B82F6; padding-left: 10px;">Shipment Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #F9FAFB; padding: 15px; border-radius: 8px;">
              <div>
                <p style="color: #6B7280; font-size: 12px; margin: 0 0 3px 0;">Tracking ID:</p>
                <p style="color: #1F2937; font-size: 14px; font-weight: bold; margin: 0;">${shipment.trackingId}</p>
              </div>
              <div>
                <p style="color: #6B7280; font-size: 12px; margin: 0 0 3px 0;">Status:</p>
                <p style="color: #059669; font-size: 14px; font-weight: bold; margin: 0;">${shipment.status}</p>
              </div>
              <div>
                <p style="color: #6B7280; font-size: 12px; margin: 0 0 3px 0;">Weight:</p>
                <p style="color: #1F2937; font-size: 14px; font-weight: bold; margin: 0;">${shipment.weight} kg</p>
              </div>
              <div>
                <p style="color: #6B7280; font-size: 12px; margin: 0 0 3px 0;">Created:</p>
                <p style="color: #1F2937; font-size: 14px; font-weight: bold; margin: 0;">${new Date(shipment.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <!-- Addresses -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div style="background: #EFF6FF; padding: 15px; border-radius: 8px; border-left: 4px solid #3B82F6;">
              <h4 style="color: #1F2937; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">Sender Information</h4>
              <p style="color: #1F2937; font-size: 13px; font-weight: bold; margin: 0 0 3px 0;">${shipment.senderName}</p>
              <p style="color: #6B7280; font-size: 12px; margin: 0 0 3px 0;">${shipment.senderPhone}</p>
              <p style="color: #6B7280; font-size: 12px; margin: 0;">${shipment.senderAddress}</p>
            </div>
            <div style="background: #F0FDF4; padding: 15px; border-radius: 8px; border-left: 4px solid #059669;">
              <h4 style="color: #1F2937; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">Receiver Information</h4>
              <p style="color: #1F2937; font-size: 13px; font-weight: bold; margin: 0 0 3px 0;">${shipment.receiverName}</p>
              <p style="color: #6B7280; font-size: 12px; margin: 0 0 3px 0;">${shipment.receiverPhone}</p>
              <p style="color: #6B7280; font-size: 12px; margin: 0;">${shipment.receiverAddress}</p>
            </div>
          </div>

          <!-- Cost Breakdown -->
          <div style="margin-bottom: 25px;">
            <h3 style="color: #1F2937; font-size: 16px; font-weight: bold; margin-bottom: 10px; border-left: 4px solid #3B82F6; padding-left: 10px;">Cost Breakdown</h3>
            <div style="background: #F9FAFB; padding: 15px; border-radius: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6B7280; font-size: 13px;">Base Shipping Cost:</span>
                <span style="color: #1F2937; font-size: 13px; font-weight: bold;">$25.00</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6B7280; font-size: 13px;">Weight Charge (${shipment.weight} kg × $2/kg):</span>
                <span style="color: #1F2937; font-size: 13px; font-weight: bold;">$${(parseFloat(shipment.weight) * 2).toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6B7280; font-size: 13px;">Priority Handling:</span>
                <span style="color: #1F2937; font-size: 13px; font-weight: bold;">$5.00</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6B7280; font-size: 13px;">Insurance:</span>
                <span style="color: #1F2937; font-size: 13px; font-weight: bold;">$3.00</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6B7280; font-size: 13px;">Fuel Surcharge:</span>
                <span style="color: #1F2937; font-size: 13px; font-weight: bold;">$2.50</span>
              </div>
              <div style="border-top: 2px solid #E5E7EB; margin-top: 10px; padding-top: 10px; display: flex; justify-content: space-between;">
                <span style="color: #1F2937; font-size: 14px; font-weight: bold;">TOTAL AMOUNT:</span>
                <span style="color: #3B82F6; font-size: 16px; font-weight: bold;">$${(35.50 + parseFloat(shipment.weight) * 2).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1F2937; font-size: 14px; font-weight: bold; margin-bottom: 8px;">Terms and Conditions</h3>
            <ul style="color: #6B7280; font-size: 11px; margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 3px;">Payment is due within 30 days of invoice date</li>
              <li style="margin-bottom: 3px;">Late payments subject to 1.5% monthly interest</li>
              <li style="margin-bottom: 3px;">Goods are transported at owner's risk</li>
              <li style="margin-bottom: 3px;">Claims for damaged goods must be filed within 7 days</li>
              <li style="margin-bottom: 3px;">This invoice is subject to the terms of our service agreement</li>
            </ul>
          </div>

          <!-- Footer -->
          <div style="text-align: center; border-top: 2px solid #E5E7EB; padding-top: 15px; color: #6B7280; font-size: 11px;">
            <p style="margin: 0;">Thank you for choosing CourierLogix! For questions, contact our support team.</p>
            <p style="margin: 5px 0 0 0;">© 2024 CourierLogix. All rights reserved. | GST: 1234567890 | PAN: ABCDE1234F</p>
          </div>
        </div>
      `
      
      document.body.appendChild(invoiceElement)
      
      // Convert to canvas
      const canvas = await html2canvas(invoiceElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      })
      
      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = canvas.width
      const imgHeight = canvas.height
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
      const imgX = (pdfWidth - imgWidth * ratio) / 2
      const imgY = 0
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
      
      // Save the PDF
      pdf.save(`Invoice-${shipment.trackingId}.pdf`)
      
      // Clean up
      document.body.removeChild(invoiceElement)
      
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  return (
    <Button
      onClick={generateInvoice}
      variant="outline"
      size="sm"
      icon={<Download className="w-4 h-4" />}
      className={className}
    >
      Download Invoice
    </Button>
  )
}

export default PDFInvoice
