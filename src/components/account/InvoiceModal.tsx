import React from 'react';
import { Download, FileText, Printer, ShieldCheck, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

interface InvoiceModalProps {
  order?: Order | null;
  onClose?: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order: propOrder, onClose }) => {
  const { activeInvoiceOrder, setActiveInvoiceOrder } = useStore();

  const order = propOrder || activeInvoiceOrder;

  if (!order) return null;

  const handleClose = () => {
    if (onClose) onClose();
    setActiveInvoiceOrder(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${order.orderNumber.replace('FX-', '2026-')}`;

  // Estimate GST portions (Jewellery ~3% GST, Apparel/Footwear ~5% GST; average modeled at 3% embedded)
  const gstRate = 0.03;
  const taxableValue = Math.round(order.subtotal / (1 + gstRate));
  const cgstAmount = Math.round((order.subtotal - taxableValue) / 2);
  const sgstAmount = cgstAmount;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity print:hidden"
        onClick={handleClose}
      />

      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 print:p-0">
        <div
          className="relative bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-stone-200 overflow-hidden z-10 print:shadow-none print:border-none print:max-w-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Actions Bar (Hidden during print) */}
          <div className="p-4 bg-stone-900 text-white flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#f8b4b4]" />
              <span className="text-xs font-semibold tracking-wider uppercase">
                Tax Invoice / Bill of Supply
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="text-stone-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Container */}
          <div className="p-6 sm:p-10 font-sans text-stone-900 text-xs">
            {/* Invoice Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start pb-6 border-b border-stone-200 gap-4">
              <div>
                <h1 className="font-serif-luxury text-2xl font-bold tracking-[0.2em] text-stone-900">
                  FOAXX
                </h1>
                <p className="text-[9px] tracking-[0.3em] text-stone-500 uppercase mt-0.5">
                  WEAR YOUR WOW · LUXURY RETAIL PVT. LTD.
                </p>
                <div className="text-[11px] text-stone-500 mt-2 space-y-0.5">
                  <p>Flagship Studio: 149 D L Rd, Dehradun, Uttarakhand 248001</p>
                  <p>GSTIN: <strong className="text-stone-800">05AABCU9603R1ZM</strong> · Customer Care: <strong className="text-stone-800">+91 98376 63372</strong></p>
                  <p>State: Uttarakhand (Code: 05) · Email: foaxx.studio@gmail.com</p>
                </div>
              </div>

              <div className="sm:text-right">
                <span className="inline-block bg-stone-100 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider mb-2">
                  Original for Recipient
                </span>
                <p className="text-xs font-semibold text-stone-900">Invoice No: {invoiceNumber}</p>
                <p className="text-stone-500 text-[11px]">Order No: {order.orderNumber}</p>
                <p className="text-stone-500 text-[11px]">Date: {order.date}</p>
                <p className="text-stone-500 text-[11px]">
                  Place of Supply: {order.shippingAddress.state} (Code: 29)
                </p>
              </div>
            </div>

            {/* Billing & Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-5 border-b border-stone-200 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Billed To / Delivered To:
                </span>
                <p className="font-semibold text-stone-900 text-sm">{order.shippingAddress.name}</p>
                <p className="text-stone-600 mt-0.5">{order.shippingAddress.address}</p>
                {order.shippingAddress.locality && (
                  <p className="text-stone-600">{order.shippingAddress.locality}</p>
                )}
                <p className="text-stone-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} -{' '}
                  <span className="font-semibold text-stone-800">{order.shippingAddress.pincode}</span>
                </p>
                <p className="text-stone-600 mt-1">Phone: +91 {order.shippingAddress.phone}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                  Logistics & Fulfillment:
                </span>
                <p className="text-stone-700">
                  Courier Partner: <strong>{order.courier}</strong>
                </p>
                <p className="text-stone-700">
                  AWB / Tracking No: <strong className="font-mono">{order.trackingNumber}</strong>
                </p>
                <p className="text-stone-700">
                  Payment Mode: <strong>{order.paymentMethod}</strong>
                </p>
                <p className="text-stone-700">
                  Payment Status: <strong className="text-emerald-700">{order.paymentStatus}</strong>
                </p>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-stone-800 text-[10px] uppercase font-semibold text-stone-600">
                    <th className="py-2 pr-2">#</th>
                    <th className="py-2 px-2">Description of Goods</th>
                    <th className="py-2 px-2 text-center">HSN/SAC</th>
                    <th className="py-2 px-2 text-center">Variant / Size</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-2 text-right">Unit Price</th>
                    <th className="py-2 pl-2 text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {order.items.map((item, idx) => {
                    const isJewellery =
                      item.product.category.toLowerCase().includes('jewel') ||
                      item.product.category.toLowerCase().includes('earring') ||
                      item.product.category.toLowerCase().includes('necklace') ||
                      item.product.category.toLowerCase().includes('ring');
                    const hsn = isJewellery ? '71131930' : '62044220';

                    return (
                      <tr key={idx} className="hover:bg-stone-50">
                        <td className="py-3 pr-2 text-stone-400">{idx + 1}</td>
                        <td className="py-3 px-2">
                          <p className="font-semibold text-stone-900">{item.product.name}</p>
                          <p className="text-[10px] text-stone-500">{item.product.material}</p>
                        </td>
                        <td className="py-3 px-2 text-center font-mono text-[11px] text-stone-500">
                          {hsn}
                        </td>
                        <td className="py-3 px-2 text-center text-stone-600">
                          {item.selectedColor || 'Default'}
                          {item.selectedSize ? ` / ${item.selectedSize}` : ''}
                        </td>
                        <td className="py-3 px-2 text-center font-semibold text-stone-900">
                          {item.quantity}
                        </td>
                        <td className="py-3 px-2 text-right text-stone-700">
                          ₹{item.product.price.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 pl-2 text-right font-semibold text-stone-900">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Calculations Breakdown */}
            <div className="mt-4 pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between gap-6">
              <div className="space-y-1.5 text-[11px] text-stone-500 max-w-sm">
                <p className="font-semibold text-stone-800">GST Breakdown (Included in Total):</p>
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span>Taxable Base Value:</span>
                  <span className="font-medium text-stone-800">₹{taxableValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span>Central GST (CGST @ 1.5%):</span>
                  <span className="font-medium text-stone-800">₹{cgstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-b border-stone-100 pb-1">
                  <span>State GST (SGST @ 1.5%):</span>
                  <span className="font-medium text-stone-800">₹{sgstAmount.toLocaleString('en-IN')}</span>
                </div>

                {order.giftOption?.enabled && (
                  <div className="mt-2 p-2 bg-[#FAF7F2] rounded-md border border-[#EFE8DE] text-stone-700">
                    <p className="font-semibold text-[#E07A5F]">🎁 Gift Packaging Attached:</p>
                    {order.giftOption.recipientName && (
                      <p>Recipient: {order.giftOption.recipientName}</p>
                    )}
                    {order.giftOption.message && (
                      <p className="italic">"{order.giftOption.message}"</p>
                    )}
                  </div>
                )}
              </div>

              {/* Total Card */}
              <div className="w-full sm:w-64 space-y-1.5 text-xs text-stone-600 bg-stone-50 p-3.5 rounded-lg border border-stone-200/60">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-stone-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-rose-600">
                    <span>Discount ({order.appliedCoupon || 'Promo'}):</span>
                    <span className="font-medium">-₹{order.discount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Shipping & Delivery:</span>
                  <span className="font-medium text-stone-900">
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                  </span>
                </div>

                {order.giftWrappingFee && order.giftWrappingFee > 0 ? (
                  <div className="flex justify-between">
                    <span>Luxury Keepsake Packaging:</span>
                    <span className="font-medium text-stone-900">₹{order.giftWrappingFee}</span>
                  </div>
                ) : null}

                <div className="border-t border-stone-300 pt-2 flex justify-between font-bold text-sm text-stone-900">
                  <span>Invoice Total:</span>
                  <span>₹{order.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Footer Guarantee & Signatory */}
            <div className="mt-8 pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between text-[10px] text-stone-500 gap-4">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Computer generated tax invoice. Valid without physical signature.</span>
              </div>

              <div className="text-center sm:text-right">
                <p className="font-serif-luxury font-bold text-stone-800 text-xs tracking-widest">
                  FOAXX LUXURY RETAIL PVT. LTD.
                </p>
                <p className="text-stone-400 text-[9px] mt-0.5">Authorised Signatory Desk</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
