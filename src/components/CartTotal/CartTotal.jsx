import React, { useContext, useState } from 'react';
import { StoreContext } from '../../pages/StoreProvider';
import { toast } from 'react-toastify';

export const CartTotal = () => {

  const { CartTotal,couponCode,
    setCouponCode,
    discount,
    setDiscount,
    subtotal,
    shippingFee,
    gstRate,
    gst,
    handleApplyCoupon,
    discountedSubtotal,
    total } = useContext(StoreContext);


  return (
    <div className='w-full mt-2 mb-10 border shadow-lg p-3'>
      <div className='text-2xl font-semibold text-gray-700'>
        <h2>CART TOTAL</h2>
      </div>

      <div className='flex flex-col gap-2 mt-5 text-md'>
        <div className='flex justify-between'>
          <p className='font-normal'>SUBTOTAL</p>
          <p className='font-normal text-gray-500'>₹ {subtotal.toFixed(2)}</p> {/* Subtotal after discount */}
        </div>

        {discount > 0 && (
          <>
            <hr />
            <div className='flex justify-between'>
              <p className='font-normal'>DISCOUNT ( {discount}% )</p>
              <p className='font-normal text-red-700'>- ₹ {(subtotal * (discount / 100)).toFixed(2)}</p>
            </div>
          </>
        )}


        <hr />

        <div className='flex justify-between'>
          <p className='font-normal'>GST ( 12% )</p>
          <p className='font-normal text-green-700'>₹ {(discountedSubtotal * gstRate).toFixed(2)}</p>
        </div>

        <hr />

        <div className='flex justify-between'>
          <p className='font-normal'>SHIPPING FEE</p>
          <p className='font-normal text-green-700'>₹ {shippingFee}</p>
        </div>

        <hr />

        <div className='flex justify-between mt-2'>
          <p className='font-semibold'>TOTAL</p>
          <p className='text-red-700 font-semibold'>₹ {total.toFixed(2)}</p>
        </div>

        {/* Coupon Code Input */}

        <div className='mt-5 border px-3 mb-4'>
          <h2 className='mt-2 mb-4'>Apply Here! If you have any Coupon Code</h2>
          <input
            type='text'
            value={couponCode} 
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder='Enter coupon code'
            className='border px-4 py-2 mb-3'
          />
          <button className='bg-black text-white text-md px-4 py-2 mb-2' onClick={handleApplyCoupon}>
            Apply Coupon
          </button>
          
        </div>
      </div>
    </div>
  );
};
