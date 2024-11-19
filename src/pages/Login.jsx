import React, { useContext, useState, useEffect } from 'react'
import { StoreContext } from './StoreProvider';
import { toast } from 'react-toastify';
import { Footer } from '../components/Footer/Footer';

export const Login = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  const {navigate} = useContext(StoreContext);

  const [currentState, setCurrentState] = useState('SIGN UP');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (currentState === 'SIGN UP') {
      localStorage.setItem('user', JSON.stringify(formData));
      console.log(formData);
      toast.success('Registration successful! Please log in.');
      setCurrentState('LOG IN');
    }

    else if (currentState === 'LOG IN') {
      
      const storedUser = JSON.parse(localStorage.getItem('user'));

      if (storedUser) {
        
        if (formData.email === storedUser.email) {
          
          if (formData.password === storedUser.password) {
            console.log('Login successful');
            toast.success('Login successful!');
            navigate('/');
          } else {
            toast.error('Incorrect Password!');
          }
        } else {
          toast.error('Email does not exist');
        }
      } else {
        toast.error('No user found, please sign up');
      }
    }
  }
  return (
    <>
      <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-[120px] gap-4 text-gray-700 border p-5 shadow-lg md:mb-[200px] mb-20'>

        <div className='inline-flex items-center gap-2 mb-2 mt-5 md:mt-10'>
          <p className='text-3xl'>{currentState}</p>
          <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
        </div>


        

        {/* Name input only for SIGN UP */}

        {currentState === 'SIGN UP' && (
          <input
            type='text'
            name='name'
            className='w-full px-3 py-2 border border-gray-800'
            placeholder='Name'
            
            onChange={handleInputChange}
            required
          />
        )}

        <input
          type='email'
          name='email'
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Email'
          
          onChange={handleInputChange}
          required
        />

        <input
          type='password'
          name='password'
          className='w-full px-3 py-2 border border-gray-800'
          placeholder='Password'
          
          onChange={handleInputChange}
          required
        />

        <div className='w-full flex justify-between text-sm'>
          <p className='cursor-pointer'>Forgot Password ?</p>

          {/* Toggle between SIGN UP and LOG IN */}
          {currentState === 'LOG IN' ? (
            <p onClick={() => setCurrentState('SIGN UP')} className='cursor-pointer'>
              Create Account
            </p>
          ) : (
            <p onClick={() => setCurrentState('LOG IN')} className='cursor-pointer'>
              Login Here
            </p>
          )}
        </div>

        {/* Submit button */}
        <button className='bg-black text-white px-4 py-2 w-full mb-5'>
          {currentState === 'LOG IN' ? 'LOG IN' : 'SIGN UP'}
        </button>

      </form>

      <Footer/>
    </>
  )
}