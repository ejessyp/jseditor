import React, { useState, useEffect } from 'react';
import { Link} from 'react-router-dom';


 const  Navigation = () => {
    // {setisLogin(sessionStorage.getItem('email') ?  "show" : "hidden")}
    // const [isLogin, setisLogin] = useState("hidden");
    const [isLogin, setisLogin] = useState("hidden");

    useEffect(() => {
        const email =   sessionStorage.getItem("email") ? "showFileMenu"  :  "hidden" ;
        const el= document.getElementById("file");
        el.classList.add(email);

    });

    return (

        <nav>
            <ul>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/Register">Register</Link>
                </li>
                <li  id="file">
                    <Link to="/file">File</Link>
                </li>
                <li>
                    <Link to="/about">About</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navigation;
