import React from 'react';
import Card from 'react-bootstrap/Card';
import Placeholder from 'react-bootstrap/Placeholder';
import { useState} from 'react';

import './cardes.css';


export default function Cardes({ titulo, descricao, urlImg }: { titulo: string, descricao: string, urlImg: string }) {
    const [isLoading, setIsLoading] = useState(true);

    const handleImageLoad = () => {
        setIsLoading(false);
    };

    function renderImg() {
        if (isLoading) {
            return (
                <Card bg={"dark"}
                    key={"dark"}
                    text={"light"}
                    className='maxWidth'>
                    <Card.Img variant="top" src={urlImg} className='formatoImg' onLoad={handleImageLoad} />

                    <Card.Body>
                        <Placeholder as={Card.Title} animation="glow">
                            <Placeholder xs={6} />
                        </Placeholder>
                        <Placeholder as={Card.Text} animation="glow">
                            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
                            <Placeholder xs={6} /> <Placeholder xs={8} />
                        </Placeholder>
                    </Card.Body>
                </Card>
            )
        } else {
            return (
                <Card
                    bg={"dark"}
                    key={"dark"}
                    text={"light"}
                    className='maxWidth'
                >

                    <Card.Img variant="top" src={urlImg} className='formatoImg'/>
                    <Card.Body>
                        <Card.Title>{titulo}</Card.Title>
                        <Card.Text>
                            {descricao}
                        </Card.Text>
                    </Card.Body>
                </Card>
            )

        }
    }

    return (
        <>
            {renderImg()}
        </>
    )
}