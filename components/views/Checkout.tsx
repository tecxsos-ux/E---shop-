'use client';
import React from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useRouter } from 'next/navigation';
const Checkout = () => {
    const { state } = React.useContext(StoreContext);
    const router = useRouter();
    return <div className="p-8"><h1>Checkout</h1><p>Cart Total: ${state.cart.reduce((a,b)=>a+b.price*b.quantity,0)}</p></div>;
};
export default Checkout;