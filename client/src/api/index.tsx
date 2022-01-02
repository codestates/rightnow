import axios from "axios";

export default function api(name: string, body?: object, code?: object) {
    switch (name) {
        case "login":
            console.log('123')
            break;
        case "logout":
            break;
        case "getUserInfo":
            break;
        case "signup":
            break;
        case "signout":
            break;
        case "update":
            break;
        case "uploadProfileImage":
            break;
        case "emailAuth":
            break;
        case "reportUser":
            break;
        case "reportRoom":
            break;
        case "getUserAll":
            break;
    }
}
