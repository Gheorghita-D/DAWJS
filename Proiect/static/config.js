const LoginHtml = `<form action="action_page.php" method="post">
  <div class="container">
    <label for="uname"><b>Username</b></label>
    <input type="text" placeholder="Enter Username" name="uname" required>

    <label for="psw"><b>Password</b></label>
    <input type="password" placeholder="Enter Password" name="psw" required>

    <button type="submit">Login</button>
    <label>
      <input type="checkbox" checked="checked" name="remember"> Remember me
    </label>
  </div>

  <div class="container" style="background-color:#f1f1f1">
    <button type="button" class="cancelbtn">Cancel</button>
    <span class="psw">Forgot <a href="#">password?</a></span>
  </div>
</form>`

const loginJs = ``


const RegisterHtml = `<form action="action_page.php">
<div class="container">
  <h1>Register</h1>
  <p>Please fill in this form to create an account.</p>
  <hr>

  <label for="email"><b>Email</b></label>
  <input type="text" placeholder="Enter Email" name="email" required>

  <label for="psw"><b>Password</b></label>
  <input type="password" placeholder="Enter Password" name="psw" required>

  <label for="psw-repeat"><b>Repeat Password</b></label>
  <input type="password" placeholder="Repeat Password" name="psw-repeat" required>
  <hr>

  <p>By creating an account you agree to our <a href="#">Terms & Privacy</a>.</p>
  <button type="submit" class="registerbtn">Register</button>
</div>

<div class="container signin">
  <p>Already have an account? <a href="#">Sign in</a>.</p>
</div>
</form>`

const RegisterJs = ``

const boardHtml = `<section>
<main>
    <article id="lists">
        <div class="list"><label for="noCategory">No category</label>
            <ul id="noCategory"></ul>
        </div><button>&#x2b;</button>
    </article>
</main>
<aside>
</aside>
<div class="modal">
    <div class="modalContent">
        <label class='close'>&times;</label>
        <input class='newCategory' placeholder="Category name">
    </div>
</div>


</section>`

const boardJS = `btn = document.querySelector('button')
section = document.querySelector("section")


var selectedEl = []

btn.addEventListener('click', (e) => {
    var task = document.createElement('li')
    var title = document.createElement('input')
    title.setAttribute('placeholder','tasks title')
    title.style.height =  '30px'
    title.style.margin =  '5px'
    title.style.borderRadius = '5px'
    title.style.padding =  '5px'
    task.appendChild(title)
    document.getElementById("noCategory").appendChild(task)
    title.focus()

    task.setAttribute('draggable', 'true')
    addHandlers(task)

    title.addEventListener('keypress', (e) => {
        let key = e.which || e.keyCode
        if(key === 13){
            let name = document.createElement('span')
            name.innerHTML = e.target.value
            let strong = document.createElement('strong')
            strong.appendChild(name)

            var del = document.createElement('span')
            del.innerHTML = '&times;'
            addDelEv(del)


            var cb = document.createElement('input')
            cb.setAttribute("type", "checkbox")
            addCheckEv(cb)

            e.target.parentNode.insertBefore(del, e.target)
            e.target.parentNode.insertBefore(strong, del)
            e.target.parentNode.insertBefore(cb, strong)
            e.target.parentNode.removeChild(e.target)

            fetch('http://localhost:3000/tasks',
                     {method: 'POST',    
                     headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: {title: e.target.value}
                    })
                .then((response) => {
                return response.json();
              })
              .then((myJson) => {
                console.log(myJson);
              });
        }
    })

})

function addCheckEv(cb){
    cb.addEventListener('change', (e) => {
        let fields = e.target.parentNode.childNodes
        if(e.target.checked){
            e.target.parentNode.style.backgroundColor = 'rgba(100, 200, 100, 0.5)'
            fields[1].style.opacity = 0.2
            fields[2].style.opacity = 0.3
        }else{
            e.target.parentNode.style.backgroundColor = 'rgba(200, 200, 200, 0.5)'
            fields[1].style.opacity = 1
            fields[2].style.opacity = 1
        }
    })
}

function addDelEv(del){
    del.addEventListener('click', (e) => {
                if(selectedEl.includes(e.target.parentNode)){
                    selectedEl = selectedEl.filter(function(value, index, arr){
                                    return value != e.target.parentNode;
                                });
                }
                e.target.parentNode.parentNode.removeChild(e.target.parentNode)
            })
}

function addHandlers(el){
    el.addEventListener( 'click', clickHandler)

    el.addEventListener('dragstart', dragStartHandler)

    el.addEventListener('dragover', dragOverHandler)
    el.addEventListener('dragleave', dragLeaveHandler)
    el.addEventListener('drop', dropHandler)
}


function clickHandler(e){
    if(e.ctrlKey){
        if(selectedEl.includes(this)){
            selectedEl = selectedEl.filter(function(value, index, arr){
                                return value != e.target;
                            });
            this.classList.remove('selected')
        }
        else{
            selectedEl[selectedEl.length] = this
            this.classList.add('selected')
        }
    }
}

function dragStartHandler(e){
    if(!e.target.classList.contains('selected')){
        for(var i=0; i<selectedEl.length; i++)
            selectedEl[i].classList.remove('selected')
        selectedEl = [e.target]
        e.target.style.opacity = '40%'
    }
    else
        for(i=0; i<selectedEl.length; i++)
                selectedEl[i].style.opacity = "40%"

}

function dragOverHandler(e) {
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.

    this.classList.add('over');

    return false;
}

function dragLeaveHandler(e) {
    this.classList.remove('over');
}


function dropHandler(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    this.classList.remove('over')

    var dropHTML = ''
    for(i=0; i<selectedEl.length; i++){
        dropHTML += selectedEl[i].outerHTML
    }
    this.insertAdjacentHTML('beforebegin',dropHTML);

    var dropElem = this.previousSibling;
    for(i=selectedEl.length-1; i>=0; i--){
        if(selectedEl[i].firstChild.checked)
            dropElem.firstChild.checked = true
        dropElem.style.opacity = '100%'
        dropElem.classList.remove('selected')
        addCheckEv(dropElem.firstChild)
        addDelEv(dropElem.lastChild)
        addHandlers(dropElem);
        
        dropElem = dropElem.previousSibling
    }


    for(i=0; i<selectedEl.length; i++)
        selectedEl[i].parentNode.removeChild(selectedEl[i])

    selectedEl = []

    return false;
}

section.addEventListener("dragover", overSection)
section.addEventListener("drop", dropOnSection)

function overSection(e){
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.

    return false;
}

document.querySelector('.close').addEventListener("click", (e)=>{
    document.querySelector(".modal").style.display = 'none'
})
document.querySelector('.newCategory').addEventListener('keypress', newCategoryHandler)

function dropOnSection(e){
    document.querySelector(".modal").style.display = 'block'
    document.querySelector('.newCategory').focus()
}

function newCategoryHandler(e){
    let key = e.which || e.keyCode
    if(key === 13){
        var div = document.createElement("div")
        div.classList.add('list')
        div.addEventListener("dragover", overList)
        div.addEventListener("drop", dropOnList)

        var label = document.createElement("label")
        label.setAttribute('for', e.target.value + document.querySelectorAll('.list').length)
        label.innerHTML = e.target.value

        var ul = document.createElement("ul")
        ul.setAttribute('id', e.target.value + document.querySelectorAll('.list').length)
        for(var i=0; i<selectedEl.length; i++){
            selectedEl[i].style.opacity = '100%'
            selectedEl[i].classList.remove('selected')
            ul.appendChild(selectedEl[i])
        }

        div.appendChild(label)
        div.appendChild(ul)
        document.querySelector('#lists').insertBefore(div, 
            document.querySelector('#lists').lastChild.previousSibling)

        selectedEl = []

        e.target.value = ''
        document.querySelector('.modal').style.display = 'none'

    }
}

document.querySelector('.list').addEventListener("dragover", overList)
document.querySelector('.list').addEventListener("drop", dropOnList)

function overList(e){
    if (e.preventDefault)
        e.preventDefault(); // Necessary. Allows us to drop.

    return false;
}

function dropOnList(e){
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    for(var i=0; i<selectedEl.length; i++){
        selectedEl[i].style.opacity = '100%'
        selectedEl[i].classList.remove('selected')
        this.lastChild.appendChild(selectedEl[i])
    }

    selectedEl = []
}`


const routes = [{
  title: 'board',
  pathname: '/board',
  controller: boardJS,
  htmlTemplate: boardHtml
},{
    title: 'login',
    pathname: '/login',
    controller: loginJs,
    htmlTemplate: LoginHtml 
}, {
    title: 'register',
    pathname: '/register',
    controller: RegisterJs,
    htmlTemplate: RegisterHtml
}];

// store url on load
var currentPage = location.href;

// listen for changes
setInterval(function()
{
    if (currentPage != location.href)
    {
        console.log(currentPage, location.href);
        // page has changed, set new page as 'current'
        currentPage = location.href;
        for (let i = 0; i < routes.length; i++) {
            if (routes[i].pathname === window.location.pathname) {
              const target = document.getElementById("target")
              target.innerHTML = routes[i].htmlTemplate
              let jsScript = document.createElement('script');
              jsScript.innerHTML = routes[i].controller;
              target.appendChild(jsScript);
            }
          }
        console.log('+++ currentPage', currentPage);
    } 
}, 500);

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

// window.onhashchange = () => {
//     for (let i = 0; i < routes.length; i++) {
//       if (routes[i].pathname === window.location.pathname) {
//         const target = document.getElementById("target")
//         target.innerHTML = routes[i].htmlTemplate
//         let jsScript = document.createElement('script');
//         jsScript.innerHTML = routes[i].controller;
//         target.appendChild(jsScript);
//       }
//     }
//   }



const onNavigate = (pathname) => {
  window.history.pushState(
    {},
    pathname,
    window.location.origin + pathname
  )

  for (let i = 0; i < routes.length; i++) {
    if (routes[i].pathname === pathname) {
      const target = document.getElementById("target")
      target.innerHTML = routes[i].htmlTemplate
      let jsScript = document.createElement('script');
      jsScript.innerHTML = routes[i].controller;
      target.appendChild(jsScript);
    }
  }
}