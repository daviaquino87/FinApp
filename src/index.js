const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');

const customers = []

app.use(express.json());
/*
* cpf - string
* name - string
* id - uuid
* statement - []
*/ 
app.post('/account',(request,response) => {
    const {cpf,name} = request.body;  

    const customerAlreadyExists = customers.some((costumer) => costumer.cpf === cpf);

    if(customerAlreadyExists) {
        return response.status(400).json({msg:"customer already exists!"})
    }

    customers.push({
        id: uuidv4(),
        cpf,
        name,
        statement: []
    });

    return response.status(201).json({customers:customers})
});

app.get('/statement/:cpf',(request,response) => {
    const {cpf} = request.params;

    const customer = customers.find((customer) => customer.cpf === cpf);

    if(!customer){
        return response.status(400).json({error:"costumer not found!"})
    }
    return response.json(customer.statement);
})

app.listen(3333,()=>{
    console.log('app on');
});