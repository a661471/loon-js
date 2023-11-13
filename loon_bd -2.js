为了优化这段代码，我们可以考虑以下几个方面：1. 将常量和变量 提取到全局作用域，以减少重复计算和提高可读性。2. 使用模板字符串替换传统的字符串 拼接。
3. 优化部分 代码结构。
以下是优化后的代码：```javascript 
// 全局常量 
const HTTP_STATUS = { 
INVALID : -1, 
CONNECTED: 0, 
WAITRESPONSE: 1, 
FORWARDING: 2, 
}; 
const SECURE_PROTOCOL = 'TLSv1'; 
const SECURE _CIPHER = 'AES128-S HA'; 
// 全局变量 let httpStatus; 
function initialize() { httpStatus = HTTP_STATUS.INVALID; } 
function tunnelDidConnected() { 
if ($session.proxy.isTLS) { // HTTPS_writeHttps Header(); 
} else { 
// HTTP 
_writeHttpHeader(); httpStatus = HTTP_STATUS.CONNECTED ; 
} 
return true; 
} function tunnelTLSFinished() { 
_ writeHttpsHeader(); 
httpStatus = HTTP_STATUS.CONNECTED; 
return true ; 
} 
function tunnelDidRead(data) { 
switch (httpStatus) { case HTTP_STATUS.WAITRESPONSE: // Check HTTP response code ==  200 (or other codes) // Assume success here 
console .log("HTTP handshake success"); 
http Status = HTTP_STATUS.FORWARDING ; 
$tunnel.established ($session); 
return null; // Do not forward data to client 
case HTTP_STATUS.FORWARDING: return data; 
default: 
return null; 
} 
} 
function tunnel DidWrite() { 
switch (http Status) { 
case HTTP_STATUS.CONNECT ED: 
console.log("Write HTTP CONNECT header success"); 
httpStatus = HTTP_STATUS.WAITRESPONSE; 
$tunnel.readTo($session,'\x0D\x0A\x0D\x0A'); // Read remote data until "\r\n\r\n " 
return false; // Interrupt write callback 
default: 
return true ; 
} 
} 
function tunnelDidClose () { 
return true; 
} 
// Helpers 
function_writeHttpHeader() { 
const conHost = $session.conHost; 
const conPort = $session.conPort; 
const conUa = $session.conUa; 
const header = ` 
CONNECT ${conHost}:${conPort} HTTP/1.1\r\n 
X-online-Host: keep-alive @ltetp.tv189.com\r\n 
Connection: keep-alive\r\n 
User-Agent : ${conUa} baiduboxapp/13.32.0.10 (Baidu; P1 12) NABar/1.0\r\n 
X-T5-Auth : 683556433\r\n 
Host : 153.3.236.22\r\n\r\n`; 
$tunnel.write($session, header); 
} function_writeHttpsHeader() { 
const conHost = $session.conHost ; 
const conPort = $session.conPort; 
const conUa = $session.conUa; 
const header = ` 
CONNECT ${conHost}:${conPort} HTTP/1.1\r\n 
Host: ${conHost}:${conPort}\r\n 
Connection: Upgrade\r\n 
Upgrade: websocket\r\n Pragma: no-cache\r\n 
Cache-Control: no-cache\r\n 
Sec-WebSocket-Version: 13\r\n 
Origin : https://${conHost}:${conPort }\r\n 
Sec-WebSocket-Key: ${crypto.createHash('md5') 
``` 
