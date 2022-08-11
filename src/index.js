const express = require('express');
const app = express();
const { v4: uuidv4 } = require('uuid');


app.use(express.json());

const customers = []

//Middleware

function verifyIfExistAccountCPF(request,response,next){
    const {cpf} = request.headers;
    const customer = customers.find((customer) => customer.cpf === cpf);
    if(!customer){
        return response.status(400).json({error:"costumer not found!"});
    };
    request.customer = customer;
    return  next();
}


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

app.get('/statement',verifyIfExistAccountCPF,(request,response) => {
    const {customer} = request;
    return response.json(customer.statement);
})

app.post('/deposit',verifyIfExistAccountCPF,(request,response) => {
    const {description, amount} = request.body;

    const {customer} = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }
    
    customer.statement.push(statementOperation);

    return response.status(201).send();
})

app.post('/withdraw',verifyIfExistAccountCPF,(request,response) => {
    const {description,amount} = request.body;
    const {customer} = request;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "debt"
    }

    customer.statement.push(statementOperation);

    return response.status(201).send()
})

app.listen(3333,()=>{
    console.log('app on');
});