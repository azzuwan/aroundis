const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const cors = require('cors');
const RedisGraph = require("redisgraph.js").Graph;

const opt = { host: "redis-19326.c262.us-east-1-3.ec2.cloud.redislabs.com", port: 19326, options: {db: "aroundis", user: "azzuwan",  password: "Reddoor74@)@)"}}
let graph =  new RedisGraph("grid1", "redis-19326.c262.us-east-1-3.ec2.cloud.redislabs.com", 19326, {password: "2tfKovucUvnjO5fo0kGPaIqe8KaSbBrZ"});
(async () =>{
  await graph.query("CREATE (:person{name:'roi',age:32})");
  await graph.query("CREATE (:person{name:'amit',age:30})");
  await graph.query("MATCH (a:person), (b:person) WHERE (a.name = 'roi' AND b.name='amit') CREATE (a)-[:knows]->(b)");
  
  // Match query.
  let res = await graph.query("MATCH (a:person)-[:knows]->(:person) RETURN a.name");
  while (res.hasNext()) {
      let record = res.next();
      console.log(record.get("a.name"));
  }
  console.log(res.getStatistics().queryExecutionTime());

  // Match with parameters.
  let param = {'age': 30};
  res = await graph.query("MATCH (a {age: $age}) return a.name", param);
  while (res.hasNext()) {
      let record = res.next();
      console.log(record.get("a.name"));
  }

  // Named paths matching.
  res = await graph.query("MATCH p = (a:person)-[:knows]->(:person) RETURN p");
  while (res.hasNext()) {
      let record = res.next();
      // See path.js for more path API.
      console.log(record.get("p").nodeCount);
  }
  graph.deleteGraph();
  graph.close();

})();
app.use(cors())

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/test', (req,res)=>{
  res.json({name: "azzuwan", job: "Programmer"})
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(7000, () => {
  console.log('listening on *:7000');
});