import React from 'react';
import Card from "../Card/Card";
import './CardList.css'

const CardList = ({header, array}) => {
    return (
        <div className="container">
            <h3 className="header">{header} <span style={{opacity:0.6}}> - {array.length}</span></h3>
            <div className="container__content">
                {array ?
                    array.map(item =>
                    <Card key={item.ID} item={item}/>)
                    : ''
                }
            </div>
        </div>
    );
};

export default CardList;