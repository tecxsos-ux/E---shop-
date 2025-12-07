'use client';
import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import { useRouter } from 'next/navigation';
const Login = () => {
    const { dispatch } = useContext(StoreContext);
    const router = useRouter();
    const handleLogin = () => { dispatch({type:'LOGIN_USER', payload:'admin@luxe.com'}); router.push('/profile'); };
    return <div className="p-8"><button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login as Admin</button></div>;
};
export default Login;