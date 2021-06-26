$(document).ready(function(){
     $("#addButton").click(function(){
        console.log("adding a new element");

        var messageText = $("#messageInput").val();
        console.log(messageText);

        $("<div class=\"input-group mb-3 d-flex justify-content-end\"><div type=\"text\" class=\"form-control message\" disabled=\"true\"><span>"
        + messageText + 
        "</span></div></div>"
        ).insertBefore("#newMessage");

        $("#newMessage").prev().fadeIn();
    });
  });
