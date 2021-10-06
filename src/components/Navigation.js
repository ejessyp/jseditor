import React, {useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';


 const  Navigation = () => {
    // {setisLogin(sessionStorage.getItem('email') ?  "show" : "hidden")}
    // const [isLogin, setisLogin] = useState("hidden");
    // const [isLogin, setisLogin] = useState("hidden");
    const [user, setUser] = useState("");
    useEffect(() => {
    { /*
        setInterval was used in order to refresh the page constantly
    in order to have the "logout" button show immediately in place of
    "login", as soon as user logs out.
    */}
        setInterval(() => {
            //const userString = sessionStorage.getItem("email");

            setUser(sessionStorage.getItem("email"));
            }, [])
    }, 5000);
    const logout = () => {
       return sessionStorage.removeItem("email");
   }
    console.log(user);
         if (!user) {
             return (
                 <nav>
                     <ul>
                         <li>
                             <NavLink to="/login" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>Login</NavLink>
                         </li>
                         <li>
                             <NavLink to="/register" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>Register</NavLink>
                         </li>
                         <li>
                             <NavLink to="/about" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>About</NavLink>
                         </li>
                     </ul>
                 </nav>
             )
         }
         if (user) {
             return(
             <nav>
                 <ul>
                     <li>
                         <NavLink to="/logout" activeStyle={{fontWeight: "bold", color: '#F3E16D'}} onClick={logout}>Logout</NavLink>
                     </li>
                     <li>
                         <NavLink to="/register" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>Register</NavLink>
                     </li>
                     <li>
                         <NavLink to="/file" activeStyle={{fontWeight: "bold", color: '#F3E16D'}} >File</NavLink>
                     </li>
                     <li>
                         <NavLink to="/about" activeStyle={{fontWeight: "bold", color: '#F3E16D'}}>About</NavLink>
                     </li>
                 </ul>
             </nav>
         )
         }
};

export default Navigation;
