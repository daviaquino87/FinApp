const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');

const costumers = []

app.use(express.json());
/*
* cpf - string
* name - string
* id - uuid
* statement - []
*/ 
app.post('/account',(request,response) => {
    const {cpf,name} = request.body;  

    const costumersAlreadyExists = costumers.some(costumer => costumer.cpf === cpf);

    if(costumersAlreadyExists) {
        return response.status(400).json({msg:"costumer already exists!"})
    }

    costumers.push({
        id: uuidv4(),
        cpf,
        name,
        statement: []
    });

    return response.status(201).json({costumers:costumers})
});

app.listen(3333,()=>{
    console.log('app on');
});