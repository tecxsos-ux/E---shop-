'use client';
import React from 'react';
import { StoreContext } from '../../context/StoreContext';
const Profile = () => {
    const { state } = React.useContext(StoreContext);
    return <div className="p-8"><h1>Profile</h1><p>User: {state.user?.name}</p></div>;
};
export default Profile;