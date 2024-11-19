import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from './StoreProvider';
import { CartTotal } from '../components/CartTotal/CartTotal';
import { useLocation } from 'react-router-dom';


export const Cart = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { products, cartItems, updateQuantity, navigate } = useContext(StoreContext);

  const [cartData, setcartData] = useState([]);

  useEffect(() => {

    const tempData = Object.entries(cartItems)
      .filter(([id, quantity]) => quantity > 0)
      .map(([id, quantity]) => ({
        id,
        quantity
      }));

    console.log(tempData);
    setcartData(tempData);
  }, [cartItems]);

  const location = useLocation();

  const handleCheckout = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      navigate('/place-order');
    } else {
      navigate('/login', { state: { from: location } });
    }
  };


  return cartData.length > 0 ? (
    <>
      <div className='border-t mt-5'>

        <div className='text-2xl font-medium md:mb-10 mt-5'>
          <h2>YOUR CART</h2>
        </div>

        <div className='mt-5'>
          {cartData.map((item, index) => {
            const productData = products.find((product) => product.id === item.id);
            return (
              <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[0.5fr_1fr_0.5fr_0.2fr] md:grid-cols-[0.5fr,2.5fr,0.5fr_0.5fr] items-center'>

                <div className='flex items-start gap-4'>
                  <img src={productData.images[0]} alt={productData.name} className='w-16 md:w-24' />
                </div>

                <div>
                  <p className='text-sm md:text-lg font-semibold'>{productData.name}</p>
                  <div className='flex items-center gap-5 mt-2'>
                    <p className='text-sm md:text-md text-red-700 font-semibold'>₹ {productData.price}/-</p>
                  </div>
                </div>

                <input
                  className='border max-w-16 px-2 py-0.5'
                  type='number'
                  min={1}
                  defaultValue={item.quantity}
                  onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                />

                <img
                  className='w-6 cursor-pointer'
                  src={'assets/frontend_assets/bin_icon.png'}
                  onClick={() => updateQuantity(item.id, 0)}
                />

              </div>
            )
          })}
        </div>

        <div>
          <div className='flex justify-end my-10'>

            <div className='w-full sm:w-[450px]'>
              <CartTotal />
              <div className='w-full text-end'>
                <button className='bg-gray-900 text-white text-md px-8 py-3'
                  onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
              </div>
            </div>

          </div>
        </div>


      </div>
    </>
  ) : (
    <>
      <>
        <div className='h-[200px] md:h-[360px]'>
          <p className='md:mt-[100px] mt-[100px] text-center text-2xl'>Your Cart is Empty</p>
        </div>
      </>
    </>
  );
}
