const express = require('express');
const v1Router = require("./v1/routes/pointRoutes")

const bodyParser = require("body-parser");
const apicache = require("apicache");
const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");
const app = express();
const cache = apicache.middleware;
const PORT = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(cache("2 minutes"));
app.use("/api/v1/points", v1Router);




app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
    V1SwaggerDocs(app, PORT);
});
