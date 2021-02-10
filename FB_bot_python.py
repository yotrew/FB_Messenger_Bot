# -*- coding: utf-8 -*-
"""
Created on Wed Feb 10 11:36:31 2021

@author: Yotrew Wing
Description:Using Flask&Requests in Python to create A FB bot 
"""
from flask import Flask, request
import requests
ACCESS_TOKEN = "FB_ACCESS_TOKEN"
VERIFY_TOKEN="FB_TEST_Token"

app = Flask(__name__)
@app.route("/", methods=['GET'])
def call_get():
#this is for renewing the webhook
    data = request.args
    if data["hub.verify_token"] == VERIFY_TOKEN:
        return data["hub.challenge"]
    return ""
@app.route("/", methods=['POST'])
def call_post():
#this is for renewing the webhook
    data = request.get_json()#Ref:https://stackoverflow.com/questions/20001229/how-to-get-posted-json-in-flask
    #app.logger.info("Request data: " + data)
    #print(data["entry"])
    pageEntry=dict(data["entry"][0])
    event=dict(pageEntry['messaging'][0])
    userID=event["sender"]['id']
    userMessage = event["message"]["text"]
    sendMessage(userID,userMessage)
    return "Ok"

def sendMessage(recipientId, messageText):
    payload= {"recipient": str({"id": recipientId}),\
               "message":   str({"text": messageText}),\
               "access_token": ACCESS_TOKEN,
              }
    #print(payload)
    r=requests.post("https://graph.facebook.com/v9.0/me/messages",data = payload)
    r.encoding="utf-8"
    if "error" in r.text:
        app.logger.info("Error: " + r.text)
        print(r.text)

if __name__ == "__main__":
    app.run()