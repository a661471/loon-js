const HTTP_STATUS_INVALID = -1;
const HTTP_STATUS_CONNECTED = 0;
const HTTP_STATUS_WAIT_RESPONSE = 1;
const HTTP_STATUS_FORWARDING = 2;

let httpStatus = HTTP_STATUS_INVALID;

function onTunnelConnected() {
  console.log($session);
  if ($session.proxy.isTLS) {
    // https
  } else {
    // http
    writeHttpHeader();
    httpStatus = HTTP_STATUS_CONNECTED;
  }
  return true;
}

function onTunnelTLSFinished() {
  httpStatus = HTTP_STATUS_CONNECTED;
  writeHttpHeader();
  return true;
}

function onTunnelRead(data) {
  switch (httpStatus) {
    case HTTP_STATUS_WAIT_RESPONSE:
      // check http response code == 200
      // Assume success here
      console.log("http handshake success");
      httpStatus = HTTP_STATUS_FORWARDING;
      $tunnel.established($session);
      return null; // don't forward the data to the client
    case HTTP_STATUS_FORWARDING:
      return data;
    default:
      return null;
  }
}

function onTunnelWrite() {
  switch (httpStatus) {
    case HTTP_STATUS_CONNECTED:
      console.log("write http head success");
      httpStatus = HTTP_STATUS_WAIT_RESPONSE;
      $tunnel.readTo($session, "\x0D\x0A\x0D\x0A"); // read remote data until \r\n\r\n appears
      return false; // interrupt the write callback
    default:
      return true;
  }
}

function onTunnelClose() {
  return true;
}

function writeHttpHeader() {
  const host = $session.conHost;
  const port = $session.conPort;
  const header = `CONNECT ${host}:${port} HTTP/1.1\r\nReferer:https://act.play.cn:${port}/\r\nHost:153.3.236.22:443\r\nConnection: keep-alive\r\nUser-Agent: okhttp/3.11.0 Dalvik/2.1.0 (Linux; U; Android 11; Build/RP1A.200720.011) baiduboxapp/13.10.0.10 (Baidu; P1 11)\r\nX-T5-Auth: 1962898709\r\nProxy-Connection: keep-alive\r\n\r\n`;
  $tunnel.write($session, header);
}