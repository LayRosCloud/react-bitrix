import React from 'react';
import './Header.css'
import {useNavigate} from "react-router-dom";
const Header = () => {
    const navigate = useNavigate()
    return (
        <header>
            <div className="logo">
                <h1 onClick={()=>navigate("/")} className="khakasiya">Хакасия.ру</h1>
                <h1 className="bitrix">Битрикс 24</h1>
            </div>
        </header>
    );
};

export default Header;