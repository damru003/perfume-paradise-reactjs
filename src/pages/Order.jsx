import React, { useContext, useEffect, useRef, useState } from 'react';
import { StoreContext } from './StoreProvider';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const Order = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { confirmedOrders, formData } = useContext(StoreContext);

  const gstRate = 0.12; // Update GST rate to 12% as shown in the invoice
  const shippingFee = 100;
  const discountRate = 0.10;
  const [showbill, setShowBill] = useState(false)

  const subtotal = confirmedOrders.reduce((total, order) => total + (order.price * order.quantity), 0);
  const gst = subtotal * gstRate;
  const discount = subtotal * discountRate;
  const totalPrice = subtotal + gst + shippingFee - discount;

  const storedUser = JSON.parse(localStorage.getItem('user'));
  const userName = storedUser ? storedUser.name : 'Guest';

  const invoiceRef = useRef();

  const downloadInvoice = () => {
    const element = invoiceRef.current;

    if (!element) {
      console.error('Invoice element is not available');
      return;
    }

    html2canvas(element, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new jsPDF('portrait', 'pt', 'a4');
        const imgWidth = 595.28; // A4 size width in points
        const pageHeight = 841.89; // A4 size height in points
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        // Add first page
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // Add more pages if needed
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('invoice.pdf');
      })
      .catch((error) => {
        console.error('Error generating PDF:', error);
      });
  };

  return (
    <>
      <div className='border-t mt-5'>
        <div>
        {storedUser ? <h1 className='text-xl md:text-3xl font-semibold mt-3 md:mt-16'>
            Hey {userName}, Your Orders
          </h1>
          : <h1 className='text-xl md:text-3xl font-semibold mt-3 md:mt-16'>
            You need to Login first for your Orders
          </h1>}
          
        </div>

        <div className='mb-20 md:mb-20'>
          {confirmedOrders.length > 0 ? (
            confirmedOrders.map((item, index) => (
              <div
                key={index}
                className='py-4 border-t text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-5'
              >
                <div className='flex items-start gap-6 text-sm'>
                  <img className='w-20' src={item.images[0]} alt={item.name} />
                  <div>
                    <p className='text-sm font-medium'>{item.name}</p>
                    <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                      <p className='text-lg text-red-500 font-semibold'>₹ {item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>

                    {/* Displaying user's delivery information */}
                    <div>
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.street}, {formData.city}, {formData.state}</p>
                      <p>{formData.zipCode}, {formData.country}</p>
                      <p>{formData.phone}</p>
                    </div>

                    <p className='mt-2'>
                      Date: <span>{new Date().toLocaleDateString()}</span>
                    </p>
                  </div>
                </div>

                <div className='flex justify-between'>
                  <div className='flex items-center gap-2'>
                    <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                    <p>{item.status}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className='text-gray-700 mt-3'>You have no confirmed orders.</p>
          )}
        </div>

        {confirmedOrders.length > 0 && (
          <div className='flex justify-end mb-10 mt-10 gap-4'>
            <button
              className='text-white bg-black px-4 py-2'
              onClick={() => setShowBill(true)}
            >
              Show Invoice
            </button>
            <button
              className='text-white bg-black px-4 py-2'
              onClick={() => setShowBill(false)}
            >
              Hide Invoice
            </button>
          </div>
        )}


        {showbill === true ? 
          <div ref={invoiceRef} className='' id='invoice'>
          <div className="p-8 bg-white font-sans max-w-4xl mx-auto border border-gray-200 rounded-lg shadow">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl md:text-5xl font-bold">Perfume Paradise Ltd.</h1>
                <div className="mt-4 text-sm md:text-md">
                  <p>FROM</p>
                  <p>Perfume Paradise Ltd.</p>
                  <p>2006 Harvest Lane</p>
                  <p>New Delhi, DL 110088</p>
                </div>
              </div>
              <div className="text-right text-sm md:text-md">
                <div className="text-gray-600">RECEIPT # 8001</div>
                <div className="text-gray-600">RECEIPT DATE {new Date().toLocaleDateString()}</div>
                <div className="mt-10">
                  <div className="w-48 rounded-full flex items-center justify-center">
                    <img src={'assets/logo_perfume.png'} className='w-40 md:w-64' alt='logo' />
                  </div>
                </div>
              </div>
            </div>

            {/* Billing and Shipping */}
            <div className="flex justify-between gap-4 mt-8">
              <div className='text-sm md:text-md'>
                <p className="font-bold">BILL TO</p>
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.street}</p>
                <p>{formData.city}, {formData.state} {formData.zipCode}</p>
                <p>{formData.phone}</p>
              </div>
              <div className='text-sm md:text-md'>
                <p className="font-bold">SHIP TO</p>
                <p>{formData.firstName} {formData.lastName}</p>
                <p>{formData.street}</p>
                <p>{formData.city}, {formData.state} {formData.zipCode}</p>
              </div>
            </div>

            {/* Table */}
            <div className="mt-8 border-t border-gray-300">
              <table className="w-full mt-4 text-left">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="py-1 md:py-2 text-[12px] md:text-lg">QTY</th>
                    <th className="py-1 md:py-2 text-[12px] md:text-lg">NAME</th>
                    <th className="py-1 md:py-2 text-[12px] md:text-lg">PRICE</th>
                  </tr>
                </thead>
                <tbody>
                  {confirmedOrders.map((order, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-1 md:py-2 text-[12px] md:text-lg">{order.quantity}</td>
                      <td className="py-1 md:py-2 text-[12px] md:text-lg">{order.name}</td>
                      <td className="py-1 md:py-2 text-[12px] md:text-lg">₹ {order.price}/-</td>
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="flex justify-end mt-14">
              <div className="w-full max-w-xs">
                <div className="flex justify-between py-2">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>GST 12%</span>
                  <span>₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Shipping Fee</span>
                  <span>₹{shippingFee}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>Discount</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-b border-gray-300 py-2">
                  <span className="font-bold text-lg">TOTAL</span>
                  <span className="font-bold text-lg">₹{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Signature */}
            <div className="mt-8">
              <p className="text-right">Perfume Paradise Ltd.</p>
            </div>
            <div className='flex justify-end mt-2'>
              <img src={'assets/stamp.jpg'} className='w-24 rounded-full' />
            </div>

            {/* Footer */}
            <div className="mt-12 text-gray-600">
              <p className="font-bold">TERMS & CONDITIONS</p>
              <p>Payment is due within 5 days.</p>
              <p>Please check products at the time of delivery.</p>
            </div>
          </div>
        </div>
        
        : ''}

        {showbill === true ? 
          <div className='flex justify-center mb-10 mt-10'>
            <button
              className='text-white bg-black px-4 py-2'
              onClick={downloadInvoice}
            >
              Download Invoice
            </button>
          </div>
        : ''
        }

      </div>
    </>
  );
};
