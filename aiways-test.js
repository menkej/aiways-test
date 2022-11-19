"use strict";

const axios = require("axios");
const crypto = require ("crypto");

const CS_URL = "https://coiapp-api-eu.ai-ways.com:10443/";
const language = "de";
const version = "1.1.0";
const platform = "android";
const deviceid = "";
const apptimezone = "GMT+02:00";
const apptimezoneid = "Europe/Berlin";


const account = getState("0_userdata.0.aiwaystest.aiways-app-login").val;;
const pw = getState("0_userdata.0.aiwaystest.aiways-app-password").val;

var path = "aiways-passport-service/passport/login/password";

const requestHeaders = {
    apptimezone: apptimezone,
    apptimezoneid: apptimezoneid,
    "content-type": "application/json; charset=utf-8",
    "accept-encoding": "gzip",
    "user-agent": "okhttp/4.3.1",
};

axios({
    method: "post",
    url: CS_URL + path,
    requestHeaders: requestHeaders,
    data: {
        account: account,
        password: crypto.createHash("md5").update(pw).digest("hex"),
    },
}).then(
    (response) => {
        console.log(response.data.data.token);
        console.log(response.data.data);
        setState('0_userdata.0.aiwaystest.aiways-token'/*aiways-token*/, response.data.data.token);
        setState('0_userdata.0.aiwaystest.aiways-login'/*aiways-login*/, true);
        //console.log(response.data.data.userId);
        //console.log(response.data.data);
        setState('0_userdata.0.aiwaystest.aiways-userid'/*aiways-userid*/, response.data.data.userId);
        //userId=response.data.data.userId;
    },
    (error) => {
        console.log(error);
    },
);


async function getCondition(token, vin) {

    var path = "app/vc/getCondition";

    const userId = getState("0_userdata.0.aiwaystest.aiways-userid").val;
    //const vin = getState('0_userdata.0.aiwaystest.aiways-vin').val;
    //var token = getState('0_userdata.0.aiwaystest.aiways-token'/*aiways-login*/).val;

    console.log("getCondition started with token " + token);

    const requestHeaders = {
        "token": token,
        "apptimezone": apptimezone,
        "apptimezoneid": apptimezoneid,
        "content-type": "application/json; charset=utf-8",
        "accept-encoding": "gzip",
        "user-agent": "okhttp/4.3.1",
    };

    axios({
        method: "post",
        url: CS_URL + path,
        requestHeaders: requestHeaders,
        data: {
            "userId": userId,
            "vin": vin,
        },
    }).then(
        (response) => {
            console.log(response.data);
            setState('0_userdata.0.aiwaystest.aiways-response'/*aiways-response*/, response.data);
            //setState('0_userdata.0.aiwaystest.aiways-login'/*aiways-login*/, true);
        },
        (error) => {
            console.log(error);
        },
    );

}

async function logout(token) {

    console.log("logout triggered with token: " + token)

    var path = "aiways-passport-service/passport/logout";

    const requestHeaders = {
        token: token,
        apptimezone: apptimezone,
        apptimezoneid: apptimezoneid,
        "accept-encoding": "gzip",
        "user-agent": "okhttp/4.3.1",
    };

    axios({
        method: "get",
        url: CS_URL + path,
        requestHeaders: requestHeaders,
    }).then(
        (response) => {
            console.log(response.data);
            //setState('0_userdata.0.aiwaystest.aiways-response'/*aiways-rsponse*/, response.data);
            setState('0_userdata.0.aiwaystest.aiways-login'/*aiways-login*/, false);
        },
        (error) => {
            console.log(error);
        },
    );
}


on({ id: '0_userdata.0.aiwaystest.aiways-login'/*aiways-login*/, change: "ne" }, async function (obj) {
    // angemeldet?
    var value = obj.state.val;
    var oldValue = obj.oldState.val;
    
    var token = getState('0_userdata.0.aiwaystest.aiways-token'/*aiways-login*/).val;
    const vin = getState('0_userdata.0.aiwaystest.aiways-vin').val;

    if (value != oldValue && value) {
        console.log("angemeldet");

        await getCondition(token, vin);
        //await logout(token);
    } else {
        console.log("abgemeldet");
    }
});

