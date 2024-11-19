import React, { useContext, useEffect, useState } from 'react';
import { CartTotal } from '../components/CartTotal/CartTotal';
import { StoreContext } from './StoreProvider';
import { toast } from 'react-toastify';

export const Placeorder = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [method, setMethod] = useState('cod');

  const { cartItems, products, navigate, setConfirmedOrders, clearCart, formData, setFormData, errors, validateForm } = useContext(StoreContext);


  const handlePlaceOrder = () => {
    if (!validateForm()) {
      toast.error('Please fill in all the required fields.');
      return;
    }

    const newConfirmedOrders = Object.entries(cartItems)
      .filter(([id, quantity]) => quantity > 0)
      .map(([id, quantity]) => {
        const product = products.find((product) => product.id === id);
        return {
          ...product,
          quantity,
          status: 'CONFIRMED',
        };
      });

    setConfirmedOrders(newConfirmedOrders);
    clearCart();
    navigate('/orders');
  };

  return (
    <>
      <div className='flex flex-col sm:flex-row justify-between mt-5 min-h-[85vh] border-t mb-10'>
        <div className='flex flex-col gap-4 w-full sm:max-w-[480px]'>

          <div className='text-2xl font-semibold text-gray-700 mt-5 md:mt-10'>
            <h1 className='text-gray-700'>DELIVERY INFORMATION</h1>
          </div>

          <div className='flex gap-3 mt-2 md:mt-6'>
            <input
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type='text'
              placeholder='Enter First Name'
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            {errors.firstName && <p className='text-white bg-red-500 text-sm p-2'>{errors.firstName}</p>}
            <input
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type='text'
              placeholder='Enter Last Name'
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
            {errors.lastName && <p className='text-white bg-red-500 text-sm p-2'>{errors.lastName}</p>}
          </div>

          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='email'
            placeholder='Enter Email Address'
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          {errors.email && <p className='text-white bg-red-500 text-sm p-2'>{errors.email}</p>}

          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='text'
            placeholder='Enter Street'
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          />
          {errors.street && <p className='text-white bg-red-500 text-sm p-2'>{errors.street}</p>}

          <div className='flex gap-3'>
            <input
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type='text'
              placeholder='Enter City'
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            />
            {errors.city && <p className='text-white bg-red-500 text-sm p-2'>{errors.city}</p>}
            <input
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type='text'
              placeholder='Enter State'
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            />
            {errors.state && <p className='text-white bg-red-500 text-sm p-2'>{errors.state}</p>}
          </div>

          <div className='flex gap-3'>
            <input
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type='number'
              placeholder='Enter Zip Code'
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            />
            {errors.zipCode && <p className='text-white bg-red-500 text-sm p-2'>{errors.zipCode}</p>}
            <input
              className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
              type='text'
              placeholder='Enter Country'
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            {errors.country && <p className='text-white bg-red-500 text-sm p-2'>{errors.country}</p>}
          </div>

          <input
            className='border border-gray-300 rounded py-1.5 px-3.5 w-full'
            type='number'
            placeholder='Enter Phone'
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          {errors.phone && <p className='text-white bg-red-500 text-sm p-2'>{errors.phone}</p>}
        </div>

        <div>
          <div className='sm:mt-5 md:mt-10 min-w-80 py-5 md:py-10'>
            <CartTotal />
          </div>

          <div>
            <div className='text-2xl font-semibold text-gray-700 border shadow-lg p-3'>
              <h1>PAYMENT METHOD</h1>
              <div className='flex flex-col gap-2 mt-5'>
                <div onClick={() => setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'stripe' ? 'bg-gray-700' : ''}`}></p>
                  <img className='h-8' src={'assets/frontend_assets/stripe_logo.png'} alt='Stripe' />
                </div>
                <div onClick={() => setMethod('gpay')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'gpay' ? 'bg-gray-700' : ''}`}></p>
                  <img className='h-8' src={'assets/frontend_assets/google_pay.png'} alt='gpay' />
                </div>
                <div onClick={() => setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
                  <p className={`min-w-3.5 h-3.5 border rounded-full ${method === 'cod' ? 'bg-gray-700' : ''}`}></p>
                  <img className='h-8' src={'assets/frontend_assets/cash_on_delivery.png'} alt='cod' />
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-between items-center mt-6'>
            <button
              className='bg-black text-white px-4 py-2 hover:bg-gray-800'
              onClick={handlePlaceOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
