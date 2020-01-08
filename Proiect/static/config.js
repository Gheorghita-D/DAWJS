import { Login } from "../src/login/login.template.js";
import { RegisterHtml } from "../src/register/register.template.js";
import { BoardHtml } from "../src/board/board.template.js";
import { BoardJs } from "../src/board/board.controller.js";

const loginJs = ``
const RegisterJs = ``

const routes = [{
  title: 'board',
  pathname: '/board',
  controller: BoardJs,
  htmlTemplate: BoardHtml
},{
    title: 'login',
    pathname: '/login',
    controller: loginJs,
    htmlTemplate: Login 
}, {
    title: 'register',
    pathname: '/register',
    controller: RegisterJs,
    htmlTemplate: RegisterHtml
}];


window.onload = function() {
    for (let i = 0; i < routes.length; i++) {
        if (routes[i].pathname === window.location.pathname) {
          const target = document.getElementById("target")
          if (target.innerHTML !== routes[i].htmlTemplate) {
            target.innerHTML = routes[i].htmlTemplate
          let jsScript = document.createElement('script');
          jsScript.innerHTML = routes[i].controller;
          target.appendChild(jsScript);
          }
          
        }
      }
}

// export const onNavigate = (pathname) => {
//   window.history.pushState(
//     {},
//     pathname,
//     window.location.origin + pathname
//   )

//   for (let i = 0; i < routes.length; i++) {
//     if (routes[i].pathname === pathname) {
//       const target = document.getElementById("target")
//       target.innerHTML = routes[i].htmlTemplate
//       let jsScript = document.createElement('script');
//       jsScript.innerHTML = routes[i].controller;
//       target.appendChild(jsScript);
//     }
//   }
// }

// store url on load
// var currentPage = location.href;

// listen for changes
// window.onpopstate = function(){
//     if (currentPage != location.href)
//     {
//         console.log(currentPage, location.href);
//         // page has changed, set new page as 'current'
//         currentPage = location.href;
//         for (let i = 0; i < routes.length; i++) {
//             if (routes[i].pathname === window.location.pathname) {
//               const target = document.getElementById("target")
//               target.innerHTML = routes[i].htmlTemplate
//               let jsScript = document.createElement('script');
//               jsScript.innerHTML = routes[i].controller;
//               target.appendChild(jsScript);
//             }
//           }
//         console.log('+++ currentPage', currentPage);
//     } 
// }
