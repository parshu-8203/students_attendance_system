
import React, { useState } from 'react';
import loader from '../assets/loader.gif';
const Loader = () => {

    return (
        <div style={{position:"absolute", width:"100%", top:"30%", left:"50%"}}>
            <img style={{width:"10%"}}src={loader} alt="Loading..."/>
        </div>
    );
};

export default Loader;
