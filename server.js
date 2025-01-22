import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      if (msg.type === 'request') {
        // 生成 reply_confirm 消息回复客户端
        const replyMsg = {
          type: 'reply_confirm',
          data: msg.data,
          requestId: msg.requestId ?? 'confirm',
        };
        ws.send(JSON.stringify(replyMsg));
      }
    } catch (err) {
      console.error('Invalid message:', err);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// 客户端发送请求示例
function sendRequestToAllClients(requestData) {
  const requestMsg = {
    type: 'request',
    data: requestData,
    requestId: Date.now().toString(),
  };
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(requestMsg));
    }
  });
}

// 测试调用
sendRequestToAllClients({ info: 'test' });