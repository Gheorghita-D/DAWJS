var btn = document.getElementById("new-project");
btn.addEventListener("click", addProject);


function randomString(length) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    if (! length) {
        length = Math.floor(Math.random() * chars.length);
    }
    var str = '';
    for (var i = 0; i < length; i++) {
        str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
}

function addProject(button){

    // creez elementele din structura html a unui proiect
    var container = document.getElementById("project-container");
    var link = document.createElement('a');
    var project = document.createElement('li');
    var title = document.createElement('h3');
    var desc = document.createElement('p');
    var deadline = document.createElement('p');

    var title_input = document.createElement('input');
    title_input.setAttribute('placeholder', 'project title');
    title_input.setAttribute('class', 'input_proiect');

    
    var desc_input = document.createElement('input');
    desc_input.setAttribute('placeholder', 'project description');
    desc_input.setAttribute('class', 'input_proiect');
    
    var deadline_input = document.createElement('input');
    deadline_input.setAttribute('placeholder', 'project deadline');
    deadline_input.setAttribute('class', 'input_proiect');
    deadline_input.setAttribute('type', 'date');

    
    var rand = randomString(8); 
   
    // pun atributele necesare fiecarui element
    project.setAttribute("class", "project");
    project.setAttribute("id", rand);
    desc.setAttribute("class", "descriere");
    deadline.setAttribute("class", "deadline");

    // ---

    var text;
    container.appendChild(link);
    link.appendChild(project);
    project.appendChild(title_input);
    project.appendChild(desc_input);
    project.appendChild(deadline_input);
    
    title_input.addEventListener("keyup", (e) =>{
        let key = e.which || e.keyCode
        if(key === 13){
            text = e.target.value;
            title.textContent = text;
            project.appendChild(title);
            updateProjectListDB(e.target.parentElement.getAttribute("id"), "title", text);
            project.removeChild(title_input);
            
        }
    })

    desc_input.addEventListener("keyup", (e) =>{
        let key = e.which || e.keyCode
        if(key === 13){
            text = e.target.value;
            desc.textContent = text;
            project.appendChild(desc);
            updateProjectListDB(e.target.parentElement.getAttribute("id"), "description", text);
            project.removeChild(desc_input);
            
        }
    })

    deadline_input.addEventListener("keyup", (e) =>{
        let key = e.which || e.keyCode
        if(key === 13){
            text = e.target.value;
            deadline.textContent = text;
            project.appendChild(deadline);
            updateProjectListDB(e.target.parentElement.getAttribute("id"), "deadline", text);
            project.removeChild(deadline_input);
            link.setAttribute("href", "./board?id=" + rand);
            
        }
    })

}


function updateProjectListDB(id, name, content){
    
    fetch('http://localhost:3000/addproject',{
            method: 'POST',
            mode: 'cors',    
            headers: {
                'Content-Type': 'Application/JSON',
                'Accept': 'Application/JSON'
            },
             body: JSON.stringify({
                proj_id:id,
                column_name:name,
                data:content
            })
        }).then((response) => {
            return response.json;
        }).then((myJson) => {
            console.log(myJson);
        });
}

