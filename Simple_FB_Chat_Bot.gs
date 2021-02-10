/*
Ref:https://github.com/JZL/Facebook-bot-Google-Apps-Script/blob/master/Code.gs
*/
var ACCESS_TOKEN = "Access_Token";
var VERIFY_TOKEN="FB_TEST_Token";

var DEBUG = true
//used to debug, will add to this instead of Logger.log (can't bc is being triggered outside the normal GAS runtime)
var SPREADSHEET_ID = 'PUT_SPREADHSEET_ID_HERE (make new spreadsheet and is part after "/d")'
function log(subject, body){
  if(DEBUG){
    SpreadsheetApp.openById(SPREADSHEET_ID).appendRow([subject, body]);
  }
}

function doGet(request) {//在fb developer上編輯webhook時傳回相對映的challenge
  //this is for renewing the webhook
  //  https://developers.facebook.com/apps/
  if(request.parameters["hub.verify_token"] == VERIFY_TOKEN){
    return ContentService.createTextOutput(request.parameters["hub.challenge"][0]);
  }
  return ContentService.createTextOutput("");
}


function doPost(e){
  try{
    var data = JSON.parse(e.postData.contents)
    log("data",JSON.stringify(data))
    pageEntry=data.entry[0];
    var event=pageEntry.messaging[0];
    var userID=event.sender.id;

    //----------------------------------
    var userMessage = event.message.text;
    sendMessage(userID,userMessage);//echo message to user
  }catch(e){
    log("error", e)
    
  }
}



function sendMessage(recipientId, messageText) {
  //payload.access_token = ACCESS_TOKEN
  
  var options =
      {
        "method" : "post",
        "payload" : 
          {
            "recipient": JSON.stringify({
              "id": recipientId
            }),
            "message": JSON.stringify({
              "text": messageText
            }),
            "access_token": ACCESS_TOKEN,
          }
      };
  //Ref:https://developers.facebook.com/docs/messenger-platform/send-messages 
  UrlFetchApp.fetch("https://graph.facebook.com/v9.0/me/messages", options); 
}