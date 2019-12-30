const express = require("express");
const app = express();
const router = express.Router();
const PORT = 3000;

//server.js
router.post('/#team',function(req,res){

    // the message being sent back will be saved in a localSession variable
    // send back a couple list items to be added to the DOM
    res.send({message:'<li>New list item number 1</li><li>New list item number 2</li>'});
});


app.use(express.static(__dirname));

app.get('/',function(req,res) {
    res.sendFile(__dirname + '\\index.html');
});

app.listen(PORT, () => {
    console.log(`app is listening to PORT ${PORT}`);
})

