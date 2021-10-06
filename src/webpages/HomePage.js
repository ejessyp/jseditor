import React from "react";
import { BrowserRouter as Router, Route} from 'react-router-dom';

import '../homepage.css';
import Layout from "../components/Layout";
import RegisterBox from "../components/RegisterBox";
import LoginBox from "../components/LoginBox";
import About from "../components/About";
import FileDocs from "../components/FileDocsGraph";
import  { base } from '../components/url.js';
console.log("basename", base);
// import Header from "../components/Header";

// if (window.location.hostname === "localhost") {
//     var server = ["/", "/login", "/register", "/about", "/file"]
// } else {
//     server = ["https://www.student.bth.se/~qipa19/dbwebb-kurser/editor/",
//     "https://www.student.bth.se/~qipa19/dbwebb-kurser/editor/login",
//     "https://www.student.bth.se/~qipa19/dbwebb-kurser/editor/register",
//     "https://www.student.bth.se/~qipa19/dbwebb-kurser/editor/about",
//     "https://www.student.bth.se/~qipa19/dbwebb-kurser/editor/file"]
// };

const HomePage = () => {
    return (
        // <React.Fragment>
        // <Header />
        //
        // <LoginBox />
        // <RegisterBox />
        // <About />
        // </React.Fragment>
        <Router basename={base}>
        <Layout>
            <Route exact path="/" component={LoginBox} />
            <Route path="/login" component={LoginBox} />
            <Route path="/register" component={RegisterBox} />
            <Route path="/about" component={About} />
            <Route path="/file" component={FileDocs} />
        </Layout>
        </Router>
    );
};

export default HomePage;
