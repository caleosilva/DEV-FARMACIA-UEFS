import './BotaoDark.css'
import Button from 'react-bootstrap/Button';


const BotaoDark = ({label}) => {
    return (
        <div>
            <Button className='w-100' variant="dark">{label}</Button>
        </div>
    )
}

export default BotaoDark;