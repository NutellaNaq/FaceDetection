import React from 'react';
import './Logo.css'
import logo from './Logo.png'
 


const Logo = () => {
    return (
        <div className='ma4 mt0'>
        <div className="Tilt-inner pa3">
            <img style={{paddingTop: '5px'}} src={logo} alt='The Logo'/>
            </div>
        
        </div>
    );
}

export default Logo;