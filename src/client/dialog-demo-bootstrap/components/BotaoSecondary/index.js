import './BotaoSecondary.css'
import React from 'react';

import Button from 'react-bootstrap/Button';



const BotaoSecondary = ({label}) => {
    return (
        <div>
            <Button className='w-100' variant="outline-secondary">{label}</Button>{' '}
        </div>
    )
}

export default BotaoSecondary;