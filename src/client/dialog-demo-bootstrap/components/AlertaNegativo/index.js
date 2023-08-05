import Alert from 'react-bootstrap/Alert';

export default function AlertaNegativo({mensagem}){
    return (
        <Alert variant={'danger'}>{mensagem}</Alert>
    )
}