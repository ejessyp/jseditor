import socketIOClient from "socket.io-client";

export let  ENDPOINT, url, urlUser, urlGraph, urlPdf, urlEmail, base, socket;
if (window.location.hostname === "localhost") {
    ENDPOINT = "http://127.0.0.1:1337";
    url = "http://localhost:1337/data";
    urlUser = "http://localhost:1337/users";
    urlPdf = "http://localhost:1337/pdf";
    urlEmail = "http://localhost:1337/send";
    urlGraph = "http://localhost:1337/graphql";
    base = "";
} else {
    ENDPOINT = "https://jsramverk-editor-qipa19.azurewebsites.net/";
    url = "https://jsramverk-editor-qipa19.azurewebsites.net/data";
    urlUser = "https://jsramverk-editor-qipa19.azurewebsites.net/users";
    urlPdf = "https://jsramverk-editor-qipa19.azurewebsites.net/pdf";
    urlEmail = "https://jsramverk-editor-qipa19.azurewebsites.net/send";
    urlGraph= "https://jsramverk-editor-qipa19.azurewebsites.net/graphql";
    base = '/~qipa19/dbwebb-kurser/editor/';


};
socket = socketIOClient(ENDPOINT);
