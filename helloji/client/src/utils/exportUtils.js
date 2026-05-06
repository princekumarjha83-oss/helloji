import jsPDF from 'jspdf'

export const exportToCSV = (data, filename = 'export') => {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  // Get headers from the first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvHeaders = headers.join(',')
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header]
      // Handle values that contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(',')
  )
  
  const csvContent = [csvHeaders, ...csvRows].join('\n')
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const exportShipmentsToCSV = (shipments) => {
  const exportData = shipments.map(shipment => ({
    'Tracking ID': shipment.trackingId,
    'Sender Name': shipment.senderName,
    'Sender Phone': shipment.senderPhone,
    'Receiver Name': shipment.receiverName,
    'Receiver Phone': shipment.receiverPhone,
    'Weight (kg)': shipment.weight,
    'Description': shipment.description,
    'Status': shipment.status,
    'Created Date': new Date(shipment.createdAt).toLocaleDateString(),
    'Updated Date': shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleDateString() : 'N/A',
    'Sender Address': shipment.senderAddress,
    'Receiver Address': shipment.receiverAddress
  }))
  
  exportToCSV(exportData, 'shipments')
}

export const exportToPDF = (data, filename = 'export', title = 'Report') => {
  if (!data || data.length === 0) {
    alert('No data to export')
    return
  }

  const doc = new jsPDF()
  
  // Add title
  doc.setFontSize(20)
  doc.text(title, 14, 20)
  
  // Add timestamp
  doc.setFontSize(10)
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30)
  
  // Add table headers
  const headers = Object.keys(data[0])
  const tableData = data.map(row => headers.map(header => row[header] || ''))
  
  // Configure table
  const tableOptions = {
    head: [headers],
    body: tableData,
    startY: 40,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak'
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { top: 40 }
  }
  
  // Use autoTable plugin (you'll need to install jspdf-autotable)
  try {
    doc.autoTable(tableOptions)
  } catch (error) {
    // Fallback to simple table if autoTable is not available
    let yPosition = 40
    
    // Draw headers
    headers.forEach((header, index) => {
      const xPosition = 14 + (index * 30)
      doc.setFontSize(8)
      doc.setFont(undefined, 'bold')
      doc.text(header, xPosition, yPosition)
    })
    
    yPosition += 10
    
    // Draw data rows
    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const xPosition = 14 + (cellIndex * 30)
        doc.setFontSize(8)
        doc.setFont(undefined, 'normal')
        doc.text(String(cell), xPosition, yPosition)
      })
      yPosition += 8
      
      // Add new page if needed
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }
    })
  }
  
  // Save the PDF
  doc.save(`${filename}_${new Date().toISOString().split('T')[0]}.pdf`)
}

export const exportShipmentsToPDF = (shipments) => {
  const exportData = shipments.map(shipment => ({
    'Tracking ID': shipment.trackingId,
    'Sender': shipment.senderName,
    'Receiver': shipment.receiverName,
    'Weight': `${shipment.weight} kg`,
    'Status': shipment.status,
    'Created': new Date(shipment.createdAt).toLocaleDateString()
  }))
  
  exportToPDF(exportData, 'shipments', 'Shipments Report')
}

export const exportActivityLogsToPDF = (logs) => {
  const exportData = logs.map(log => ({
    'Action': log.action,
    'Details': log.details,
    'User': log.user,
    'Time': new Date(log.timestamp).toLocaleString()
  }))
  
  exportToPDF(exportData, 'activity_logs', 'Activity Logs Report')
}

export const exportActivityLogsToCSV = (logs) => {
  const exportData = logs.map(log => ({
    'Action': log.action,
    'Details': log.details,
    'User': log.user,
    'Timestamp': log.timestamp.toISOString(),
    'Type': log.type
  }))
  
  exportToCSV(exportData, 'activity_logs')
}

// Advanced export with custom formatting
export const createCustomReport = (shipments, filters = {}) => {
  const doc = new jsPDF()
  
  // Add header
  doc.setFontSize(24)
  doc.setTextColor(59, 130, 246)
  doc.text('CourierLogix Analytics Report', 14, 25)
  
  // Add company info
  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text('Professional Logistics Solutions', 14, 35)
  doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 42)
  
  // Add filters info
  if (Object.keys(filters).length > 0) {
    doc.setFontSize(12)
    doc.setTextColor(50)
    doc.text('Applied Filters:', 14, 55)
    
    doc.setFontSize(10)
    Object.entries(filters).forEach(([key, value], index) => {
      doc.text(`${key}: ${value}`, 20, 62 + (index * 5))
    })
  }
  
  // Add statistics
  const totalShipments = shipments.length
  const deliveredShipments = shipments.filter(s => s.status === 'Delivered').length
  const inTransitShipments = shipments.filter(s => s.status === 'In Transit').length
  const deliveryRate = totalShipments > 0 ? ((deliveredShipments / totalShipments) * 100).toFixed(1) : 0
  
  doc.setFontSize(12)
  doc.setTextColor(50)
  doc.text('Summary Statistics:', 14, 85)
  
  doc.setFontSize(10)
  doc.text(`Total Shipments: ${totalShipments}`, 20, 92)
  doc.text(`Delivered: ${deliveredShipments}`, 20, 99)
  doc.text(`In Transit: ${inTransitShipments}`, 20, 106)
  doc.text(`Delivery Rate: ${deliveryRate}%`, 20, 113)
  
  // Add shipments table
  const tableData = shipments.map(shipment => [
    shipment.trackingId,
    shipment.senderName,
    shipment.receiverName,
    shipment.status,
    new Date(shipment.createdAt).toLocaleDateString()
  ])
  
  try {
    doc.autoTable({
      head: [['Tracking ID', 'Sender', 'Receiver', 'Status', 'Created']],
      body: tableData,
      startY: 125,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    })
  } catch (error) {
    console.log('AutoTable not available, using simple table')
  }
  
  // Add footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10)
    doc.text('© 2024 CourierLogix - All Rights Reserved', 14, doc.internal.pageSize.height - 10)
  }
  
  doc.save(`courierlogix_report_${new Date().toISOString().split('T')[0]}.pdf`)
}

export default {
  exportToCSV,
  exportToPDF,
  exportShipmentsToCSV,
  exportShipmentsToPDF,
  exportActivityLogsToCSV,
  exportActivityLogsToPDF,
  createCustomReport
}
