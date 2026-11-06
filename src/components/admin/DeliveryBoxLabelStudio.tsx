import React, { useState, useEffect, useMemo } from 'react';
import {
  Printer,
  Download,
  Tag,
  ShieldAlert,
  Copy,
  RefreshCw,
  Package,
  MapPin,
  Truck,
  Building,
  Check,
  Search,
  Loader2,
  Image as ImageIcon,
  CheckSquare,
  Square,
  FileText,
  Sliders,
} from 'lucide-react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';

export interface BoxLabelData {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  // Shipper / Sender Details
  shipperName: string;
  shipperAddress: string;
  shipperCityStateZip: string;
  shipperPhone: string;
  shipperGstin: string;
  shipperEmail: string;
  // Consignee / Delivery Details
  consigneeName: string;
  consigneeAddress: string;
  consigneeLocality: string;
  consigneeCity: string;
  consigneeState: string;
  consigneePincode: string;
  consigneePhone: string;
  consigneeAltPhone: string;
  // Carrier & Barcode
  courierName: string;
  awbNumber: string;
  routingHub: string;
  // Parcel Specifications
  parcelWeight: string;
  parcelDimensions: string;
  boxType: string;
  itemCount: number;
  itemsList: string;
  // Commercial & COD
  paymentMode: 'PREPAID' | 'COD';
  codAmount: number;
  declaredValue: number;
  showDeclaredValue: boolean;
  hsnCode: string;
  // Safety & Badges
  fragileHandling: boolean;
  tamperSealApplied: boolean;
  highValuePrecious: boolean;
  includePackingList: boolean;
  specialInstructions: string;
}

interface DeliveryBoxLabelStudioProps {
  orders: Order[];
  selectedOrder?: Order | null;
  onClose?: () => void;
  isModal?: boolean;
}

// Generates pristine HTML string for a 4x6" thermal label
export const renderLabelHtmlString = (labelData: BoxLabelData): string => {
  return `
    <div
      class="box-label-card"
      style="width: 360px; background-color: #ffffff; color: #000000; padding: 14px; border: 2px solid #000000; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; line-height: 1.25; box-sizing: border-box; margin: 0 auto;"
    >
      <!-- HEADER: Courier & Routing Hub -->
      <div style="display: flex; justify-content: space-between; align-items: stretch; border-bottom: 2px solid #000000; padding-bottom: 8px; gap: 8px;">
        <div style="display: flex; flex-direction: column; justify-content: space-between;">
          <div style="font-weight: 900; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase;">
            ${labelData.courierName}
          </div>
          <div style="font-size: 9px; font-family: monospace; color: #4b5563;">
            AIR PRIORITY LOGISTICS
          </div>
        </div>
        <div style="border: 2px solid #000000; padding: 4px 10px; text-align: center; background-color: #000000; color: #ffffff; flex-shrink: 0;">
          <span style="font-size: 8px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; display: block; opacity: 0.9;">
            HUB ROUTE
          </span>
          <span style="font-size: 14px; font-weight: 900; font-family: monospace; line-height: 1; display: block;">
            ${labelData.routingHub}
          </span>
        </div>
      </div>

      <!-- BARCODE SECTION -->
      <div style="padding: 10px 0; border-bottom: 2px solid #000000; text-align: center;">
        <div style="display: flex; justify-content: center; align-items: flex-end; height: 48px; gap: 1.5px; padding: 0 8px; background: #ffffff;">
          ${[
            3, 1, 4, 2, 1, 3, 2, 4, 1, 2, 3, 1, 4, 1, 2, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4,
            2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1,
            2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 2, 1, 4, 1, 3, 2, 4,
          ]
            .map(
              (height, i) =>
                `<div style="background-color: #000000; flex-shrink: 0; width: ${
                  i % 4 === 0 ? '3px' : i % 2 === 0 ? '2px' : '1px'
                }; height: ${Math.min(48, 36 + height * 2.5)}px;"></div>`
            )
            .join('')}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 4px 0 4px; font-size: 10px;">
          <span style="font-family: monospace; font-weight: 700; letter-spacing: 1px; font-size: 11px;">
            AWB: ${labelData.awbNumber}
          </span>
          <span style="font-family: monospace; font-size: 9px; text-transform: uppercase;">
            ORD: ${labelData.orderNumber}
          </span>
        </div>
      </div>

      <!-- SHIP-TO CONSIGNEE BLOCK -->
      <div style="padding: 8px 0; border-bottom: 2px solid #000000;">
        <div style="display: flex; justify-content: space-between; font-size: 9px; font-weight: 700; color: #4b5563; text-transform: uppercase; letter-spacing: 0.5px;">
          <span>SHIP TO (CONSIGNEE):</span>
          <span>PREMIUM DELIVERY</span>
        </div>
        <div style="font-weight: 900; font-size: 14px; text-transform: uppercase; margin: 4px 0 2px 0;">
          ${labelData.consigneeName}
        </div>
        <div style="font-size: 10px; line-height: 1.3;">
          <p style="margin: 0;">${labelData.consigneeAddress}</p>
          ${labelData.consigneeLocality ? `<p style="margin: 0;">${labelData.consigneeLocality}</p>` : ''}
          <p style="margin: 0; font-weight: 600;">${labelData.consigneeCity}, ${labelData.consigneeState}</p>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 6px;">
          <div style="display: inline-block; background-color: #000000; color: #ffffff; padding: 4px 10px; font-weight: 900; font-size: 16px; font-family: monospace; letter-spacing: 1px;">
            PIN: ${labelData.consigneePincode}
          </div>
          <div style="text-align: right; font-size: 10px; font-family: monospace; font-weight: 700;">
            <div>TEL: +91 ${labelData.consigneePhone}</div>
            ${labelData.consigneeAltPhone ? `<div style="font-size: 9px;">ALT: +91 ${labelData.consigneeAltPhone}</div>` : ''}
          </div>
        </div>
      </div>

      <!-- PAYMENT & COMMERCIAL ROW -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; border-bottom: 2px solid #000000; font-size: 10px;">
        <div style="padding: 6px; border-right: 2px solid #000000;">
          <span style="font-size: 8px; font-weight: 700; text-transform: uppercase; color: #4b5563; display: block;">
            PAYMENT METHOD
          </span>
          ${
            labelData.paymentMode === 'COD'
              ? `<div style="font-weight: 900; font-size: 12px; margin-top: 2px;">
                  <span style="background-color: #000000; color: #ffffff; padding: 2px 5px; display: inline-block; margin-right: 4px;">C.O.D.</span>
                  <span>COLLECT ₹${labelData.codAmount.toLocaleString('en-IN')}</span>
                </div>`
              : `<div style="font-weight: 900; font-size: 12px; margin-top: 2px;">
                  <span style="background-color: #000000; color: #ffffff; padding: 2px 5px; display: inline-block; margin-right: 4px;">PREPAID</span>
                  <span>₹0.00 TO COLLECT</span>
                </div>`
          }
        </div>
        <div style="padding: 6px;">
          <div style="display: flex; justify-content: space-between;">
            <span style="font-size: 8px; font-weight: 700; color: #4b5563;">WT:</span>
            <span style="font-family: monospace; font-weight: 700;">${labelData.parcelWeight}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 2px;">
            <span style="font-size: 8px; font-weight: 700; color: #4b5563;">DIM:</span>
            <span style="font-family: monospace;">${labelData.parcelDimensions}</span>
          </div>
          ${
            labelData.showDeclaredValue
              ? `<div style="display: flex; justify-content: space-between; border-top: 1px solid #d1d5db; padding-top: 2px; margin-top: 2px;">
                  <span style="font-size: 8px; font-weight: 700; color: #4b5563;">VALUE:</span>
                  <span style="font-family: monospace; font-weight: 700;">₹${labelData.declaredValue.toLocaleString('en-IN')}</span>
                </div>`
              : ''
          }
        </div>
      </div>

      <!-- SECURITY & HANDLING BADGES -->
      <div style="padding: 6px 0; border-bottom: 2px solid #000000; font-size: 9px; font-weight: 700;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          ${labelData.fragileHandling ? '<span style="border: 1px solid #000000; padding: 2px 6px; text-transform: uppercase;">🍸 FRAGILE</span>' : ''}
          ${labelData.highValuePrecious ? '<span style="border: 1px solid #000000; padding: 2px 6px; text-transform: uppercase;">✨ LUXURY JEWELLERY</span>' : ''}
          <span style="border: 1px solid #000000; padding: 2px 6px; text-transform: uppercase;">📦 PCS: ${labelData.itemCount}</span>
        </div>
        ${
          labelData.tamperSealApplied
            ? `<div style="background-color: #f3f4f6; border: 1px solid #000000; padding: 4px; font-size: 8px; text-align: center; font-weight: 700; margin-top: 4px;">
                🔒 SECURITY SEALED: DO NOT ACCEPT IF SEAL TAPE IS BROKEN OR TAMPERED
              </div>`
            : ''
        }
      </div>

      <!-- PACKING LIST -->
      ${
        labelData.includePackingList
          ? `<div style="padding: 6px 0; border-bottom: 2px solid #000000; font-size: 9px;">
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 8px; text-transform: uppercase; color: #4b5563;">
                <span>BOX CONTENTS PACKING MANIFEST:</span>
                <span>${labelData.hsnCode.split(' - ')[0]}</span>
              </div>
              <p style="margin: 2px 0 0 0; font-family: monospace; color: #1f2937; line-height: 1.2;">
                ${labelData.itemsList}
              </p>
            </div>`
          : ''
      }

      <!-- INSTRUCTIONS -->
      ${
        labelData.specialInstructions
          ? `<div style="padding: 4px 0; border-bottom: 2px solid #000000; font-size: 8px; color: #374151; font-style: italic;">
              Note: ${labelData.specialInstructions}
            </div>`
          : ''
      }

      <!-- SHIPPER / RTO -->
      <div style="padding-top: 6px; font-size: 8px; color: #374151;">
        <div style="font-weight: 700; color: #000000; text-transform: uppercase;">
          RETURN IF UNDELIVERED TO (SHIPPER):
        </div>
        <div style="line-height: 1.3; margin-top: 2px;">
          <strong style="color: #000000;">${labelData.shipperName}</strong><br/>
          ${labelData.shipperAddress}, ${labelData.shipperCityStateZip}<br/>
          Ph: ${labelData.shipperPhone} · GSTIN: ${labelData.shipperGstin}
        </div>
      </div>

      <!-- FOOTER -->
      <div style="padding-top: 6px; margin-top: 6px; border-top: 1px solid #d1d5db; display: flex; justify-content: space-between; font-size: 7px; font-family: monospace; color: #6b7280;">
        <span>FOAXX ATELIER LUXURY DISPATCH SYSTEM</span>
        <span>PRINTED: ${new Date().toLocaleDateString('en-GB')}</span>
      </div>
    </div>
  `;
};

export const DeliveryBoxLabelStudio: React.FC<DeliveryBoxLabelStudioProps> = ({
  orders,
  selectedOrder,
  onClose,
  isModal = false,
}) => {
  const { showToast } = useStore();

  // Multi-order selection state: stores array of selected order IDs
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>(() => {
    if (selectedOrder) return [selectedOrder.id];
    return orders.length > 0 ? [orders[0].id] : [];
  });

  // Active inspected order (for live preview and field editing)
  const [activeOrderChoice, setActiveOrderChoice] = useState<string>(
    selectedOrder?.id || orders[0]?.id || ''
  );

  // Search filter inside orders list
  const [orderSearchQuery, setOrderSearchQuery] = useState('');

  // Active customizer form tab
  const [activeSection, setActiveSection] = useState<
    'consignee' | 'carrier' | 'parcel' | 'shipper' | 'safety'
  >('consignee');

  const [copiedAWB, setCopiedAWB] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // Helper to construct label data from an order
  const buildInitialData = (order?: Order | null): BoxLabelData => {
    if (!order) {
      return {
        orderId: 'FX-MANUAL',
        orderNumber: 'FX-88901',
        orderDate: new Date().toLocaleDateString('en-GB'),
        shipperName: 'FOAXX ATELIER & FINE JEWELLERY PVT LTD',
        shipperAddress: 'Plot 44, Luxury Gemstone Plaza, DLF Cyber City, Phase II',
        shipperCityStateZip: 'Gurugram, Haryana - 122002',
        shipperPhone: '+91 98765 43210',
        shipperGstin: '07AAAAA0000A1Z5',
        shipperEmail: 'concierge@foaxx.com',
        consigneeName: 'Customer Name',
        consigneeAddress: 'Apartment 402, Royal Palms, Off Link Road',
        consigneeLocality: 'Near Central Mall',
        consigneeCity: 'Mumbai',
        consigneeState: 'Maharashtra',
        consigneePincode: '400053',
        consigneePhone: '9820012345',
        consigneeAltPhone: '9820098765',
        courierName: 'BlueDart Air Express',
        awbNumber: '89472190382',
        routingHub: 'BOM / 400053',
        parcelWeight: '0.45 kg',
        parcelDimensions: '20 × 15 × 8 cm',
        boxType: 'Velvet Tamper-Proof Luxury Jewellery Box',
        itemCount: 1,
        itemsList: 'Luxury Jewellery Piece (x1)',
        paymentMode: 'PREPAID',
        codAmount: 0,
        declaredValue: 18499,
        showDeclaredValue: true,
        hsnCode: 'HSN 7113 - Fine Imitation & Precious Jewellery',
        fragileHandling: true,
        tamperSealApplied: true,
        highValuePrecious: true,
        includePackingList: true,
        specialInstructions:
          'Security seal checked before dispatch. Handover strictly to consignee with OTP.',
      };
    }

    const cityPrefix = (order.shippingAddress.city || 'DEL').slice(0, 3).toUpperCase();
    const routingHub = `${cityPrefix} / ${order.shippingAddress.pincode || '110001'}`;
    const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const itemsSummary = order.items
      .map((it) => `${it.product.name} (x${it.quantity}${it.selectedColor ? `, ${it.selectedColor}` : ''})`)
      .join('; ');

    const isCod = order.paymentMethod?.toLowerCase().includes('cash');

    return {
      orderId: order.id,
      orderNumber: order.orderNumber,
      orderDate: order.date,
      shipperName: 'FOAXX ATELIER & FINE JEWELLERY PVT LTD',
      shipperAddress: 'Plot 44, Luxury Gemstone Plaza, DLF Cyber City, Phase II',
      shipperCityStateZip: 'Gurugram, Haryana - 122002',
      shipperPhone: '+91 98765 43210',
      shipperGstin: '07AAAAA0000A1Z5',
      shipperEmail: 'concierge@foaxx.com',
      consigneeName: order.shippingAddress.name,
      consigneeAddress: order.shippingAddress.address,
      consigneeLocality: order.shippingAddress.locality || '',
      consigneeCity: order.shippingAddress.city,
      consigneeState: order.shippingAddress.state,
      consigneePincode: order.shippingAddress.pincode,
      consigneePhone: order.shippingAddress.phone,
      consigneeAltPhone: '',
      courierName: order.courier || 'BlueDart Air Express',
      awbNumber:
        order.trackingNumber ||
        `FX${order.orderNumber.replace(/[^0-9]/g, '') || '9821'}${Math.floor(1000 + Math.random() * 9000)}`,
      routingHub,
      parcelWeight: '0.45 kg',
      parcelDimensions: '20 × 15 × 8 cm',
      boxType: 'Velvet Tamper-Proof Luxury Jewellery Box',
      itemCount: totalItems,
      itemsList: itemsSummary,
      paymentMode: isCod ? 'COD' : 'PREPAID',
      codAmount: isCod ? order.total : 0,
      declaredValue: order.total,
      showDeclaredValue: true,
      hsnCode: 'HSN 7113 - Fine Imitation & Precious Jewellery',
      fragileHandling: true,
      tamperSealApplied: true,
      highValuePrecious: true,
      includePackingList: true,
      specialInstructions:
        'Security hologram seal checked. Handover strictly to consignee upon signature.',
    };
  };

  const [labelData, setLabelData] = useState<BoxLabelData>(() =>
    buildInitialData(selectedOrder || orders.find((o) => o.id === activeOrderChoice) || orders[0])
  );

  // Sync when inspected order changes
  useEffect(() => {
    const targetOrder = orders.find((o) => o.id === activeOrderChoice);
    if (targetOrder) {
      setLabelData(buildInitialData(targetOrder));
    }
  }, [activeOrderChoice, orders]);

  // Filtered orders list for order selection view
  const visibleOrders = useMemo(() => {
    if (!orderSearchQuery.trim()) return orders;
    const q = orderSearchQuery.toLowerCase().trim();
    return orders.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.shippingAddress.name.toLowerCase().includes(q) ||
        o.shippingAddress.city.toLowerCase().includes(q) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q))
    );
  }, [orders, orderSearchQuery]);

  // Select all / Deselect all
  const handleToggleSelectAll = () => {
    if (selectedOrderIds.length === orders.length) {
      setSelectedOrderIds([]);
      showToast('Deselected all orders.');
    } else {
      setSelectedOrderIds(orders.map((o) => o.id));
      showToast(`Selected all ${orders.length} orders for batch operations.`);
    }
  };

  // Toggle individual order selection
  const handleToggleOrder = (orderId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedOrderIds((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    );
  };

  // Inspect order to customize its label
  const handleInspectOrder = (order: Order) => {
    setActiveOrderChoice(order.id);
    if (!selectedOrderIds.includes(order.id)) {
      setSelectedOrderIds((prev) => [...prev, order.id]);
    }
  };

  // Generate new random AWB
  const generateNewAWB = () => {
    const prefix = labelData.courierName.includes('BlueDart')
      ? 'BD'
      : labelData.courierName.includes('Delhivery')
      ? 'DL'
      : labelData.courierName.includes('DTDC')
      ? 'DT'
      : 'FX';
    const randNum = Math.floor(1000000000 + Math.random() * 9000000000);
    const newAwb = `${prefix}${randNum}`;
    setLabelData((prev) => ({ ...prev, awbNumber: newAwb }));
    showToast(`Generated new carrier AWB: ${newAwb}`);
  };

  // Reset to original order values
  const handleResetToOrder = () => {
    const currentOrder = orders.find((o) => o.id === activeOrderChoice) || selectedOrder;
    setLabelData(buildInitialData(currentOrder));
    showToast('Reset delivery box label to original order values.');
  };

  // Copy AWB
  const handleCopyAWB = () => {
    navigator.clipboard.writeText(labelData.awbNumber);
    setCopiedAWB(true);
    setTimeout(() => setCopiedAWB(false), 2000);
    showToast('AWB tracking code copied to clipboard!');
  };

  // Helper to create an off-screen temporary node for toPng rendering
  const createTempNode = (data: BoxLabelData): HTMLElement => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    container.style.width = '360px';
    container.style.backgroundColor = '#ffffff';
    container.style.zIndex = '-1';
    container.innerHTML = renderLabelHtmlString(data);
    document.body.appendChild(container);
    return container;
  };

  // Export PDF: supports both single order and batch multi-page compilation
  const handleSavePdf = async () => {
    const targetIds = selectedOrderIds.length > 0 ? selectedOrderIds : [activeOrderChoice];
    if (targetIds.length === 0) {
      showToast('Please select at least one order to export.', 'error');
      return;
    }

    try {
      setIsExportingPdf(true);
      showToast(
        targetIds.length > 1
          ? `Compiling ${targetIds.length}-page batch shipping PDF...`
          : 'Generating high-resolution 4x6" PDF shipping label...'
      );

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [4, 6],
      });

      for (let i = 0; i < targetIds.length; i++) {
        const oId = targetIds[i];
        const targetOrder = orders.find((o) => o.id === oId);
        if (!targetOrder) continue;

        // Use custom edited labelData if this is the active inspected order, else build from order
        const dataForOrder = oId === activeOrderChoice ? labelData : buildInitialData(targetOrder);

        const tempNode = createTempNode(dataForOrder);
        const cardElem = tempNode.querySelector('.box-label-card') as HTMLElement || tempNode;

        const imgData = await toPng(cardElem, {
          quality: 0.98,
          pixelRatio: 2.5,
          backgroundColor: '#ffffff',
          cacheBust: true,
        });

        document.body.removeChild(tempNode);

        if (i > 0) {
          pdf.addPage([4, 6], 'portrait');
        }
        pdf.addImage(imgData, 'PNG', 0.1, 0.1, 3.8, 5.8, undefined, 'FAST');
      }

      const fileName =
        targetIds.length > 1
          ? `FOAXX-Batch-Shipping-Labels-${targetIds.length}-Orders.pdf`
          : `FOAXX-Shipping-Label-${(labelData.awbNumber || labelData.orderNumber).replace(/[^a-zA-Z0-9_-]/g, '_')}.pdf`;

      pdf.save(fileName);
      showToast(`Successfully downloaded: ${fileName}`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast('Error exporting PDF. Opening printer fallback...', 'error');
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Download High-Resolution PNG for single label sticker
  const handleDownloadImage = async () => {
    const printableArea = document.getElementById('box-label-printable-area');
    if (!printableArea) return;

    try {
      setIsDownloadingImage(true);
      showToast('Rendering high-resolution thermal label image...');
      const dataUrl = await toPng(printableArea, {
        quality: 0.98,
        pixelRatio: 2.5,
        backgroundColor: '#ffffff',
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `FOAXX-Label-Sticker-${(labelData.awbNumber || labelData.orderNumber).replace(/[^a-zA-Z0-9_-]/g, '_')}.png`;
      link.href = dataUrl;
      link.click();
      showToast('Downloaded thermal shipping sticker (PNG)');
    } catch (err) {
      console.error('Error downloading label image:', err);
      showToast('Could not render label image.', 'error');
    } finally {
      setIsDownloadingImage(false);
    }
  };

  // Direct print: handles both single and batch printing with page breaks
  const handlePrint = async () => {
    const targetIds = selectedOrderIds.length > 0 ? selectedOrderIds : [activeOrderChoice];
    if (targetIds.length === 0) {
      showToast('Please select at least one order to print.', 'error');
      return;
    }

    setIsPrinting(true);

    try {
      // Build HTML pages for each selected label
      const labelsHtml = targetIds
        .map((oId) => {
          const targetOrder = orders.find((o) => o.id === oId);
          if (!targetOrder) return '';
          const dataForOrder = oId === activeOrderChoice ? labelData : buildInitialData(targetOrder);
          return `
            <div class="print-page-wrapper" style="page-break-after: always; break-after: page; width: 100%; max-width: 380px; margin: 0 auto 24px auto;">
              ${renderLabelHtmlString(dataForOrder)}
            </div>
          `;
        })
        .join('');

      // Create dedicated hidden iframe for isolated 4x6 printing
      const printIframe = document.createElement('iframe');
      printIframe.setAttribute(
        'style',
        'position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;'
      );
      document.body.appendChild(printIframe);

      const frameDoc = printIframe.contentWindow?.document;
      if (frameDoc) {
        frameDoc.open();
        frameDoc.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8" />
              <title>FOAXX Shipping Labels (${targetIds.length})</title>
              <style>
                @page {
                  size: 4in 6in;
                  margin: 2mm;
                }
                body {
                  margin: 0;
                  padding: 4mm;
                  background: #fff;
                  color: #000;
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }
                * {
                  box-sizing: border-box;
                }
                .box-label-card {
                  width: 100% !important;
                  max-width: 380px !important;
                  margin: 0 auto !important;
                  border: 2px solid #000 !important;
                  box-shadow: none !important;
                }
                @media print {
                  .print-page-wrapper {
                    page-break-after: always !important;
                    break-after: page !important;
                    margin-bottom: 0 !important;
                  }
                }
              </style>
            </head>
            <body>
              ${labelsHtml}
            </body>
          </html>
        `);
        frameDoc.close();

        setTimeout(() => {
          try {
            printIframe.contentWindow?.focus();
            printIframe.contentWindow?.print();
            showToast(
              targetIds.length > 1
                ? `Batch print command sent for ${targetIds.length} labels!`
                : 'Print command sent to printer!'
            );
          } catch (e) {
            console.warn('Iframe print restricted by sandbox:', e);
            window.print();
          } finally {
            setTimeout(() => {
              if (document.body.contains(printIframe)) {
                document.body.removeChild(printIframe);
              }
            }, 3000);
          }
        }, 400);
      } else {
        window.print();
      }
    } catch (err) {
      console.warn('Direct print blocked by browser sandbox policy:', err);
      showToast('Direct print dialog blocked in preview. Exporting PDF file directly...', 'info');
      await handleSavePdf();
    } finally {
      setIsPrinting(false);
    }
  };

  const isAllSelected = orders.length > 0 && selectedOrderIds.length === orders.length;

  return (
    <div className={`w-full ${isModal ? 'p-4 sm:p-6' : 'p-0'}`}>
      {/* Print CSS Rules */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          #box-label-printable-area, #box-label-printable-area * {
            visibility: visible !important;
          }
          #box-label-printable-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            max-width: 4.2in !important;
            margin: 0 auto !important;
            padding: 4mm !important;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: 2px solid #000000 !important;
            z-index: 999999 !important;
          }
          @page {
            size: 4in 6in;
            margin: 3mm;
          }
        }
      `}</style>

      {/* SINGLE UNIFIED HEADER & ACTION TOOLBAR (Each action appears ONLY ONCE) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-500/20">
              <Tag className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
                <span>Delivery Box Label & Packing Slip Generator</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-900 text-[#d4af37]">
                  4x6" Thermal Ready
                </span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Select individual orders or use Select All to batch-print and export multi-page PDFs with barcodes and routing hubs.
              </p>
            </div>
          </div>
        </div>

        {/* PRIMARY ACTION BAR - KEPT STRICTLY ONCE */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedOrderIds.length > 1 ? (
            <>
              {/* Batch Actions for Multiple Selected Orders */}
              <button
                onClick={() => setSelectedOrderIds([])}
                className="px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                Clear Selection
              </button>

              <button
                onClick={handleSavePdf}
                disabled={isExportingPdf}
                className="px-4 py-2 text-xs font-bold text-stone-900 bg-[#FAF7F2] hover:bg-[#F3EFE9] border-2 border-[#d4af37] rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                title={`Generate multi-page PDF for ${selectedOrderIds.length} orders`}
              >
                {isExportingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>
                  {isExportingPdf
                    ? 'Exporting Batch...'
                    : `Batch PDF (${selectedOrderIds.length} Labels)`}
                </span>
              </button>

              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-black rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md hover:scale-[1.02]"
                title={`Print ${selectedOrderIds.length} shipping labels sequentially`}
              >
                {isPrinting ? (
                  <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
                ) : (
                  <Printer className="w-4 h-4 text-[#d4af37]" />
                )}
                <span>
                  {isPrinting
                    ? 'Sending Batch...'
                    : `Batch Print (${selectedOrderIds.length} Labels)`}
                </span>
              </button>
            </>
          ) : selectedOrderIds.length === 1 ? (
            <>
              {/* Single Order Actions */}
              <button
                onClick={handleResetToOrder}
                className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Reset form fields to original order data"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleDownloadImage}
                disabled={isDownloadingImage}
                className="px-3 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                title="Download thermal label sticker image (PNG)"
              >
                {isDownloadingImage ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-600" />
                ) : (
                  <ImageIcon className="w-3.5 h-3.5 text-stone-600" />
                )}
                <span>PNG Sticker</span>
              </button>

              <button
                onClick={handleSavePdf}
                disabled={isExportingPdf}
                className="px-4 py-2 text-xs font-bold text-stone-900 bg-[#FAF7F2] hover:bg-[#F3EFE9] border border-stone-300 rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-2xs"
                title="Download 4x6 inch PDF shipping label"
              >
                {isExportingPdf ? (
                  <Loader2 className="w-3.5 h-3.5 text-amber-700 animate-spin" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>{isExportingPdf ? 'Exporting PDF...' : 'Download PDF (4x6")'}</span>
              </button>

              <button
                onClick={handlePrint}
                disabled={isPrinting}
                className="px-4 py-2 text-xs font-bold text-white bg-stone-900 hover:bg-black rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md hover:scale-[1.02]"
                title="Print label directly to thermal sticker or laser printer"
              >
                {isPrinting ? (
                  <Loader2 className="w-4 h-4 text-[#d4af37] animate-spin" />
                ) : (
                  <Printer className="w-4 h-4 text-[#d4af37]" />
                )}
                <span>{isPrinting ? 'Sending to Printer...' : 'Print Label Directly'}</span>
              </button>
            </>
          ) : (
            <div className="text-xs text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-medium">
              Select at least 1 order from the list below to print or export.
            </div>
          )}

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-xl transition-colors cursor-pointer ml-1"
              title="Close Studio"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Column Editor & Right Column Thermal Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* LEFT COLUMN: Order Selection & Customizer Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Order Selection & Batch Management Card */}
          <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-900 hover:text-black cursor-pointer bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  {isAllSelected ? (
                    <CheckSquare className="w-4 h-4 text-[#d4af37]" />
                  ) : (
                    <Square className="w-4 h-4 text-stone-500" />
                  )}
                  <span>{isAllSelected ? 'Deselect All' : `Select All (${orders.length})`}</span>
                </button>

                <span className="text-[11px] font-semibold text-stone-500">
                  <strong className="text-stone-900 font-bold">{selectedOrderIds.length}</strong> of{' '}
                  {orders.length} Selected
                </span>
              </div>

              {/* Search box for orders */}
              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter orders by ID, name, city..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs border border-stone-200 rounded-xl bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>
            </div>

            {/* Scrollable Order Selector List */}
            <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 divide-y divide-stone-50">
              {visibleOrders.map((o) => {
                const isChecked = selectedOrderIds.includes(o.id);
                const isInspected = activeOrderChoice === o.id;

                return (
                  <div
                    key={o.id}
                    onClick={() => handleInspectOrder(o)}
                    className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-colors ${
                      isInspected
                        ? 'bg-amber-50/70 border border-amber-300/80 shadow-2xs'
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Checkbox for batch selection */}
                      <button
                        type="button"
                        onClick={(e) => handleToggleOrder(o.id, e)}
                        className="text-stone-600 hover:text-black p-0.5 cursor-pointer"
                        title={isChecked ? 'Deselect order' : 'Select order for batch'}
                      >
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-stone-900" />
                        ) : (
                          <Square className="w-4 h-4 text-stone-400" />
                        )}
                      </button>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-stone-900 text-xs">
                            {o.orderNumber}
                          </span>
                          <span className="font-medium text-stone-700 truncate">
                            {o.shippingAddress.name}
                          </span>
                          <span className="text-[10px] text-stone-400">
                            ({o.shippingAddress.city})
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 flex items-center gap-2 mt-0.5 font-mono">
                          <span>₹{o.total.toLocaleString('en-IN')}</span>
                          <span>·</span>
                          <span>{o.courier || 'BlueDart'}</span>
                          <span>·</span>
                          <span>{o.shippingStatus}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      {isInspected && (
                        <span className="text-[10px] bg-stone-900 text-[#d4af37] px-2 py-0.5 rounded-full font-bold">
                          Inspecting
                        </span>
                      )}
                      <span className="text-[11px] text-stone-400 hover:text-stone-800">
                        Edit Details →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {selectedOrderIds.length > 1 && (
              <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl text-[11px] text-stone-700 flex items-center justify-between">
                <span>
                  <strong>Batch Mode Active:</strong> {selectedOrderIds.length} orders selected.
                  Exporting will compile a multi-page PDF or print sequentially.
                </span>
                <span className="font-bold text-stone-900 font-mono">
                  {selectedOrderIds.length} Labels
                </span>
              </div>
            )}
          </div>

          {/* Section Navigation Tabs for Selected Order */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-stone-200 text-xs font-semibold scrollbar-none">
            <button
              onClick={() => setActiveSection('consignee')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'consignee'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Consignee & Address</span>
            </button>

            <button
              onClick={() => setActiveSection('carrier')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'carrier'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Courier & AWB Barcode</span>
            </button>

            <button
              onClick={() => setActiveSection('parcel')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'parcel'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Package Specs & COD</span>
            </button>

            <button
              onClick={() => setActiveSection('shipper')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'shipper'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <Building className="w-3.5 h-3.5" />
              <span>Shipper / Return RTO</span>
            </button>

            <button
              onClick={() => setActiveSection('safety')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                activeSection === 'safety'
                  ? 'bg-stone-900 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Safety & Instructions</span>
            </button>
          </div>

          {/* Form Content per Active Section */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs text-xs space-y-4">
            {/* SECTION 1: CONSIGNEE */}
            {activeSection === 'consignee' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#E07A5F]" />
                    <span>Consignee (Ship-To) Delivery Information</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">All fields update live on label</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      value={labelData.consigneeName}
                      onChange={(e) =>
                        setLabelData({ ...labelData, consigneeName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Primary Contact Phone *
                    </label>
                    <input
                      type="text"
                      value={labelData.consigneePhone}
                      onChange={(e) =>
                        setLabelData({ ...labelData, consigneePhone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Street Address / House / Flat *
                  </label>
                  <textarea
                    rows={2}
                    value={labelData.consigneeAddress}
                    onChange={(e) =>
                      setLabelData({ ...labelData, consigneeAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Landmark / Locality
                    </label>
                    <input
                      type="text"
                      value={labelData.consigneeLocality}
                      onChange={(e) =>
                        setLabelData({ ...labelData, consigneeLocality: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      value={labelData.consigneeCity}
                      onChange={(e) => {
                        const newCity = e.target.value;
                        const prefix = (newCity || 'DEL').slice(0, 3).toUpperCase();
                        setLabelData({
                          ...labelData,
                          consigneeCity: newCity,
                          routingHub: `${prefix} / ${labelData.consigneePincode}`,
                        });
                      }}
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">State *</label>
                    <input
                      type="text"
                      value={labelData.consigneeState}
                      onChange={(e) =>
                        setLabelData({ ...labelData, consigneeState: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-900 mb-1">
                      Delivery Postal PIN Code * (High Priority)
                    </label>
                    <input
                      type="text"
                      value={labelData.consigneePincode}
                      onChange={(e) => {
                        const newPin = e.target.value;
                        const prefix = (labelData.consigneeCity || 'DEL').slice(0, 3).toUpperCase();
                        setLabelData({
                          ...labelData,
                          consigneePincode: newPin,
                          routingHub: `${prefix} / ${newPin}`,
                        });
                      }}
                      className="w-full px-3 py-2 border-2 border-stone-900 rounded-xl font-mono text-base font-bold text-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Alternate / Care-of Contact (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 9820011223"
                      value={labelData.consigneeAltPhone}
                      onChange={(e) =>
                        setLabelData({ ...labelData, consigneeAltPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 2: CARRIER & BARCODE */}
            {activeSection === 'carrier' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Courier Service & Barcode Routing</span>
                  </h4>
                  <button
                    onClick={generateNewAWB}
                    className="text-[#E07A5F] hover:underline font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Generate New AWB</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Courier Carrier
                    </label>
                    <select
                      value={labelData.courierName}
                      onChange={(e) =>
                        setLabelData({ ...labelData, courierName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none cursor-pointer"
                    >
                      <option value="BlueDart Air Express">BlueDart Air Express</option>
                      <option value="Delhivery Surface Express">Delhivery Surface Express</option>
                      <option value="DTDC Air Priority">DTDC Air Priority</option>
                      <option value="FedEx Premium Logistics">FedEx Premium Logistics</option>
                      <option value="Shadowfax FastAir">Shadowfax FastAir</option>
                      <option value="FOAXX Atelier White-Glove Courier">
                        FOAXX Atelier White-Glove Courier
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      AWB / Tracking Number (Printed as Barcode)
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={labelData.awbNumber}
                        onChange={(e) =>
                          setLabelData({ ...labelData, awbNumber: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold text-stone-900 focus:border-stone-900 focus:outline-none"
                      />
                      <button
                        onClick={handleCopyAWB}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
                        title="Copy AWB"
                      >
                        {copiedAWB ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Destination Routing Hub Code
                    </label>
                    <input
                      type="text"
                      value={labelData.routingHub}
                      onChange={(e) =>
                        setLabelData({ ...labelData, routingHub: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono uppercase font-bold focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Order Reference #
                    </label>
                    <input
                      type="text"
                      value={labelData.orderNumber}
                      onChange={(e) =>
                        setLabelData({ ...labelData, orderNumber: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 3: PARCEL & PACKAGING & COD */}
            {activeSection === 'parcel' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Package className="w-4 h-4 text-amber-600" />
                    <span>Parcel Dimensions, Weight & Commercials</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">Weight & Volumetric details</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Package Weight
                    </label>
                    <input
                      type="text"
                      value={labelData.parcelWeight}
                      onChange={(e) =>
                        setLabelData({ ...labelData, parcelWeight: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Dimensions (L × W × H)
                    </label>
                    <input
                      type="text"
                      value={labelData.parcelDimensions}
                      onChange={(e) =>
                        setLabelData({ ...labelData, parcelDimensions: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono focus:border-stone-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Packaging Case Type
                    </label>
                    <input
                      type="text"
                      value={labelData.boxType}
                      onChange={(e) =>
                        setLabelData({ ...labelData, boxType: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                  <span className="font-bold text-stone-900 block text-xs">
                    Commercial & Payment Terms
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Payment Mode
                      </label>
                      <select
                        value={labelData.paymentMode}
                        onChange={(e) =>
                          setLabelData({
                            ...labelData,
                            paymentMode: e.target.value as 'PREPAID' | 'COD',
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl font-bold bg-white cursor-pointer"
                      >
                        <option value="PREPAID">PREPAID (Card / UPI / NetBanking)</option>
                        <option value="COD">CASH ON DELIVERY (COD)</option>
                      </select>
                    </div>

                    {labelData.paymentMode === 'COD' && (
                      <div>
                        <label className="block font-bold text-rose-700 mb-1">
                          COD Amount to Collect (₹) *
                        </label>
                        <input
                          type="number"
                          value={labelData.codAmount}
                          onChange={(e) =>
                            setLabelData({
                              ...labelData,
                              codAmount: Number(e.target.value),
                            })
                          }
                          className="w-full px-3 py-2 border-2 border-rose-600 rounded-xl font-mono font-bold bg-white text-rose-800"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Declared Package Value (₹)
                      </label>
                      <input
                        type="number"
                        value={labelData.declaredValue}
                        onChange={(e) =>
                          setLabelData({
                            ...labelData,
                            declaredValue: Number(e.target.value),
                          })
                        }
                        className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono font-bold bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="showDeclaredValueToggle"
                      checked={labelData.showDeclaredValue}
                      onChange={(e) =>
                        setLabelData({ ...labelData, showDeclaredValue: e.target.checked })
                      }
                      className="w-4 h-4 accent-stone-900 cursor-pointer"
                    />
                    <label
                      htmlFor="showDeclaredValueToggle"
                      className="text-stone-700 font-medium cursor-pointer"
                    >
                      Print declared value on shipping label (Required for courier transit insurance)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    HSN Code & Description
                  </label>
                  <input
                    type="text"
                    value={labelData.hsnCode}
                    onChange={(e) => setLabelData({ ...labelData, hsnCode: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Itemized Content Summary (For Customs & Packing List)
                  </label>
                  <input
                    type="text"
                    value={labelData.itemsList}
                    onChange={(e) => setLabelData({ ...labelData, itemsList: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>
            )}

            {/* SECTION 4: SHIPPER / RETURN */}
            {activeSection === 'shipper' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <Building className="w-4 h-4 text-emerald-700" />
                    <span>Shipper / Return-To-Origin (RTO) Warehouse</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">Warehouse return destination</span>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Shipper Legal Entity Name
                  </label>
                  <input
                    type="text"
                    value={labelData.shipperName}
                    onChange={(e) =>
                      setLabelData({ ...labelData, shipperName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Warehouse Street Address
                  </label>
                  <input
                    type="text"
                    value={labelData.shipperAddress}
                    onChange={(e) =>
                      setLabelData({ ...labelData, shipperAddress: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      City, State & Pincode
                    </label>
                    <input
                      type="text"
                      value={labelData.shipperCityStateZip}
                      onChange={(e) =>
                        setLabelData({ ...labelData, shipperCityStateZip: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Warehouse Helpline / Dispatch Phone
                    </label>
                    <input
                      type="text"
                      value={labelData.shipperPhone}
                      onChange={(e) =>
                        setLabelData({ ...labelData, shipperPhone: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">
                      Shipper GSTIN Registration
                    </label>
                    <input
                      type="text"
                      value={labelData.shipperGstin}
                      onChange={(e) =>
                        setLabelData({ ...labelData, shipperGstin: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Support Email</label>
                    <input
                      type="text"
                      value={labelData.shipperEmail}
                      onChange={(e) =>
                        setLabelData({ ...labelData, shipperEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-stone-200 rounded-xl font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SECTION 5: SAFETY & BADGES */}
            {activeSection === 'safety' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                  <h4 className="font-bold text-stone-900 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-orange-600" />
                    <span>Handling Badges & Security Warnings</span>
                  </h4>
                  <span className="text-[10px] text-stone-400">Printed security warnings</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-stone-100">
                    <input
                      type="checkbox"
                      checked={labelData.fragileHandling}
                      onChange={(e) =>
                        setLabelData({ ...labelData, fragileHandling: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 accent-stone-900 cursor-pointer"
                    />
                    <div>
                      <strong className="block font-bold text-stone-900">
                        Fragile Handling Symbol
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        Prints wine-glass handling icon and "HANDLE WITH CARE" banner.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-stone-100">
                    <input
                      type="checkbox"
                      checked={labelData.tamperSealApplied}
                      onChange={(e) =>
                        setLabelData({ ...labelData, tamperSealApplied: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 accent-stone-900 cursor-pointer"
                    />
                    <div>
                      <strong className="block font-bold text-stone-900">
                        Security Tamper Seal Notice
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        "Do not accept if security hologram seal is broken or tampered".
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-stone-100">
                    <input
                      type="checkbox"
                      checked={labelData.highValuePrecious}
                      onChange={(e) =>
                        setLabelData({ ...labelData, highValuePrecious: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 accent-stone-900 cursor-pointer"
                    />
                    <div>
                      <strong className="block font-bold text-stone-900">
                        High Value Consignment
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        Alerts courier hub for secure lockbox transit protocol.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-stone-200 bg-stone-50 cursor-pointer hover:bg-stone-100">
                    <input
                      type="checkbox"
                      checked={labelData.includePackingList}
                      onChange={(e) =>
                        setLabelData({ ...labelData, includePackingList: e.target.checked })
                      }
                      className="w-4 h-4 mt-0.5 accent-stone-900 cursor-pointer"
                    />
                    <div>
                      <strong className="block font-bold text-stone-900">
                        Print Itemized Packing List
                      </strong>
                      <span className="text-[11px] text-stone-500">
                        Includes SKU list and count checklist at the bottom of the label.
                      </span>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">
                    Special Doorstep Delivery Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={labelData.specialInstructions}
                    onChange={(e) =>
                      setLabelData({ ...labelData, specialInstructions: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:border-stone-900 focus:outline-none"
                    placeholder="e.g. Call customer before delivery. Verify identity OTP."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Authentic 4" × 6" Thermal Label Live Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-stone-900" />
              <span>Live 4x6" Thermal Sticker Preview</span>
            </span>
            <span className="text-[10px] text-stone-400 font-mono">100mm × 150mm · 300 DPI</span>
          </div>

          {/* Thermal Label Container (Targeted by #box-label-printable-area in @media print) */}
          <div className="bg-stone-100 p-4 rounded-2xl border border-stone-300 flex justify-center shadow-inner overflow-x-auto">
            <div
              id="box-label-printable-area"
              dangerouslySetInnerHTML={{ __html: renderLabelHtmlString(labelData) }}
            />
          </div>

          {/* Thermal helper & Compatibility Specs Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3.5 text-xs text-stone-800 space-y-1.5 shadow-2xs">
            <div className="flex items-center justify-between font-bold text-stone-900">
              <span className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Thermal Printer Specifications</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Standard 4x6"</span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Compatible with Zebra, Rollo, Munbyn, Brother, TSC, and standard A4 laser sticker sheets.
              Vector-rendered barcodes ensure 100% optical scanner read accuracy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
