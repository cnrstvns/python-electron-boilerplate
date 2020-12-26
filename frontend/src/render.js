const ZMQ = require('zeromq');
const $ = require('jquery');
const ts = require('time-stamp');
const { stringify } = JSON;

const mainSock = new ZMQ.Push;
const dataSock = new ZMQ.Request;
const statusSock = new ZMQ.Pull;

mainSock.connect("tcp://127.0.0.1:7777");
dataSock.connect("tcp://127.0.0.1:7778");
statusSock.connect("tcp://127.0.0.1:7779");

$('#sendData').on("click", async() => {
    const sendData = $('#send-data').val();
    await mainSock.send(stringify({ type: "data", data: sendData }));
})

$('#sendReceiveData').on("click", async() => {
    const sendData = $('#send-receive-data').val();
    await dataSock.send(stringify({ type: "data", data: sendData }));
    const [dataResponse] = await dataSock.receive();
    $('#received-data').val(dataResponse.toString());
})

const checkStatus = async() => {
    for await(const [msg] of statusSock){
        $('#status-data').prepend(logTime(), " ", msg.toString(), "\n")
    }
}

checkStatus()

const logTime = () => {
    return ts("HH:mm:ss");
}