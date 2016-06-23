
function toggle() {
    $("#container").attr("style", "display:block;");

}


function hidePop() {
    $("#popDiv").attr("style", "display:none;");
    $("#popup").attr("style", "display:none;");

}


function showModalUserNickName() {
    $("#btnOk").click(function () {
       
        if (($('#nick').val() == "") || ($('#nick').val() == null)) {
            showModalUserNickName();
            return false;
        }
        hidePop();

        startChatHub();
    });
}


////Orignal fucntion:

//function showModalUserNickName() {
//    $("#dialog").dialog({
//        modal: false,
//        buttons: {
//            Ok: function () {
//                $(this).dialog("close");

//                if (($('#nick').val() == "") || ($('#nick').val() == null)) {
//                    showModalUserNickName();
//                    return false;
//                }

//                startChatHub();
//            }
//        }
//    });
//}

function startChatHub() {


    var chat = $.connection.chatHub;

    // Get the user name.
    $('#nickname').val($('#nick').val());
    chat.client.differentName = function (name) {

        showModalUserNickName();
        return false;

        // Prompts for different user name
        $('#nickname').val($('#nick').val());
        chat.server.notify($('#nickname').val(), $.connection.hub.id);
    };

    chat.client.online = function (name) {
        if (name != null || name != "") {
            // Update list of users
            if (name == $('#nickname').val())
                $('#onlineusers').append('<div class="border" style="color:green">You: ' + name + '</div>');
            else {
                $('#onlineusers').append('<div class="border">' + name + '</div>');
                $("#users").append('<option value="' + name + '">' + name + '</option>');
            }
        }
    };

    chat.client.enters = function (name) {
        if (name != null || name != "") {
            $('#chatlog').append('<div ><i>' + name + ' joins the conversation</i></div>');
            $("#users").append('<option value="' + name + '">' + name + '</option>');
            $('#onlineusers').append('<div style="width:300px;">' + name + '</div>');
        }
    };
    // Create a function that the hub can call to broadcast chat messages.
    chat.client.broadcastMessage = function (name, message) {
        if (name != null || name != "") {
            //Interpret smileys
            message = message.replace(":)", "<img src=\"/images/happy.gif\" class=\"smileys\" />");
            message = message.replace(":(", "<img src=\"/images/sad.gif\" class=\"smileys\" />");
            message = message.replace(":o", "<img src=\"/images/cool.gif\" class=\"smileys\" />");
            message = message.replace(":z", "<img src=\"/images/sleep.gif\" class=\"smileys\" />");
            message = message.replace(";)", "<img src=\"/images/winkey.gif\" class=\"smileys\" />");
            message = message.replace("hi::", "<img src=\"/images/hi.gif\" class=\"smileys\" />");
            //display the message
            if ((message != null || message != "") && (name != null || name != ""))
                $('#chatlog').append('<div style="width:300px;"><span style="color:orange">' + name + '</span>: ' + message + '</div>');
        }
    };

    chat.client.disconnected = function (name) {
        if (name != null || name != "") {
            //Calls when someone leaves the page
            $('#chatlog').append('<div ><i>' + name + ' leaves the conversation</i></div>');
            // $('#onlineusers div').remove(":contains('" + name + "')");
            // $("#users option").remove(":contains('" + name + "')");
            //debugger;
            $('#onlineusers div').remove(":contains('" + name + "')");
            $("#users").find('option[value="' + name + '"]').remove();
        }
    }
    chat.client.checkNameInDbScript = function (name) {

        if (name != null || name != "") {
            toggle();
        }
    }
    // Start the connection.
    $.connection.hub.start().done(function () {

        chat.server.checkNameInDb($('#nick').val());

        //Calls the notify method of the server

        chat.server.notify($('#nickname').val(), $.connection.hub.id);


        $('#btnsend').click(function () {

            if ($("#users").val() == "All") {

                // Call the Send method on the hub.
                // if ($('#message').val().length != 0) {
                chat.server.send($('#nickname').val(), $('#message').val().trim());
                //}
            }
            else {

                //if ($('#message').val().length != 0) {
                chat.server.sendToSpecific($('#nickname').val(), $('#message').val().trim(), $("#users").val());
                //}
            }
            // Clear text box and reset focus for next comment.
            $('#message').val('').focus();
        });

    });
}
