// by xiaozc. websocket的相关逻辑
// 连接服务端
var ws;
var data;

function connect() {
  // 创建websocket
  ws = new WebSocket("ws://127.0.0.1:7272");
  // 当socket连接打开时，输入用户名
  ws.onopen = onopen;
  // 当有消息时根据消息类型显示不同信息
  ws.onmessage = onmessage; 
  ws.onclose = function() {
    console.log("连接关闭，定时重连");
    connect();
  };
  ws.onerror = function() {
    console.log("出现错误");
  };
}

function onopen() {
  var login_data = '{"type":"login","client_name":"web-client","room_id":"931"}';
  ws.send(login_data);
}

// 服务端发来消息时
function onmessage(e) {
  data = eval("("+e.data+")");
  console.log("data=" + e.data);
  switch(data['type']) {
    // 服务端ping客户端
    case 'ping':
      ws.send('{"type":"pong"}');
      break;;
    // 登录 更新用户列表
    case 'login':
      //{"type":"login","client_id":xxx,"client_name":"xxx","client_list":"[...]","time":"xxx"}
      // say(data['client_id'], data['client_name'],  data['client_name']+' 加入了聊天室', data['time']);
      break;
    // 发言
    case 'say':
      //{"type":"say","from_client_id":xxx,"to_client_id":"all/client_id","content":"xxx","time":"xxx"}
      say(data['from_client_id'], data['from_client_name'], data['content'], data['time']);
      break;
    // 用户退出 更新用户列表
    case 'logout':
      //{"type":"logout","client_id":xxx,"time":"xxx"}
      // say(data['from_client_id'], data['from_client_name'], data['from_client_name']+' 退出了', data['time']);
      delete client_list[data['from_client_id']];
    }
}

connect();