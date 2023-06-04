import React from 'react';
import './Card.css'
import {useNavigate} from 'react-router-dom'
const Card = ({item}) => {
    const navigate = useNavigate();

    function navTo(){
        navigate(`/tasks/${item.ID}`)
    }

    return (
        <div onClick={() => navTo()} className="card__task">
            <h3>{item.TITLE} {item.HAS_DECISION? <span style={{color: 'green'}}>✔</span>: ''}</h3>
            <p>{item.DESCRIPTION}</p>
        </div>
    );
};

export default Card;