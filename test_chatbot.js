const handler = require('./api/chatbot');

function makeRes() {
  const res = {};
  res.headers = {};
  res.statusCode = 200;
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (obj) => { console.log('JSON RESPONSE:', JSON.stringify(obj, null, 2)); };
  res.end = () => { console.log('END'); };
  return res;
}

async function runTest(msg) {
  const req = { method: 'POST', body: { message: msg } };
  const res = makeRes();
  handler(req, res);
}

runTest('hello');
runTest('how do i earn points');
runTest('');
