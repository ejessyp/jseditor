import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';


 const  Navigation = () => {
    // {setisLogin(sessionStorage.getItem('email') ?  "show" : "hidden")}
    // const [isLogin, setisLogin] = useState("hidden");
    // const [isLogin, setisLogin] = useState("hidden");

    useEffect(() => {
        const email =   sessionStorage.getItem("email") ? "showFileMenu"  :  "hidden" ;
        const el= document.getElementById("file");
        el.classList.add(email);
    });

    return (

        <nav>
            <ul>
                <li>
                    <NavLink to="/login" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>Login</NavLink>
                </li>
                <li>
                    <NavLink to="/Register" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>Register</NavLink>
                </li>
                <li  id="file">
                    <NavLink to="/file" activeStyle={{fontWeight: "bold", color: '#F3E16D'}} >File</NavLink>
                </li>
                <li>
                    <NavLink to="/about" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>About</NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
