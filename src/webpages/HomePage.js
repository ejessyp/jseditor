import React from "react";
import { BrowserRouter as Router, Route} from 'react-router-dom';
import '../homepage.css';
import Layout from "../components/Layout";

import RegisterBox from "../components/RegisterBox";
import LoginBox from "../components/LoginBox";
import About from "../components/About";
import FileDocs from "../components/FileDocs";



const HomePage = () => {
    return (
        <Router>
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
