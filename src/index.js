const express = require('express');
const cors = require('cors');
const v1Router = require("./v1/routes/pointRoutes")

const bodyParser = require("body-parser");

const { swaggerDocs: V1SwaggerDocs } = require("./v1/swagger");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(bodyParser.json());

app.use("/api/v1/points", v1Router);




app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`);
    V1SwaggerDocs(app, PORT);
});
