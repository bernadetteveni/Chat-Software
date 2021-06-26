import User from './Users.js'
import Messages from './Messages.js'
import fs from "fs"; 

function main(){
    var user1 = new User("username1", "password1");
    var user2 = new User("username2", "password2");
    var users = [user1, user2];
    console.log(users[0].username); 
    console.log(users.length);

    var usersObj = {
        users: []
    }
    usersObj.users = users;


    fs.writeFile("./users.json", JSON.stringify(usersObj, null, 4), (err)=>{
        if(err){
            console.error(err);
            return;
        }
    });

    var task1 = new Message(
        "1 message", 
        "user1");

    console.log(task1._id);
}

main();