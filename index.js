const express = require('express')
const uuid = require("uuid")

const port = 3006
const app = express()

app.use(express.json())



const orders = []

const checkOrder = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex(order => order.id === id)
    if (index < 0) {
        return response.status(404).json({ message: "User not found" })
    }

    request.orderIndex = index
    request.orderId = id
    next()
}

const methodUrl = (request, response, next) => {

    console.log('request method:', request.method)
    console.log('request url:', request.url)
    next()
}

app.get('/orders', methodUrl, (request, response) => {
    return response.send(orders)
})



app.post('/orders', methodUrl, (request, response) => {
    const { orderclient, clientName, price, status } = request.body

    const order = { id: uuid.v4(), orderclient, clientName, price, status: "Em preparaçao" }
    orders.push(order)
    return response.status(201).json(order)
})

app.put('/orders/:id', checkOrder, methodUrl, (request, response) => {

    const { orderclient, clientName, price, status } = request.body

    const index = request.orderIndex
    const id = request.orderId


    const updatedOrder = { id, orderclient, clientName, price, status: "Em preparaçao" }



    orders[index] = updatedOrder



    return response.json(updatedOrder)
})

app.delete('/orders/:id', checkOrder, methodUrl, (request, response) => {

    const index = request.orderIndex

    orders.splice(index, 1)


    return response.status(204).json(orders)
})

app.get('/orders/:id', checkOrder, methodUrl, (request, response) => {


    const index = request.orderIndex

    const order = orders[index]
    return response.send(order)
})

app.patch('/orders/:id', checkOrder, methodUrl, (request, response) => {


    const index = request.orderIndex

    const order = orders[index]

    order.status = "Pedido Pronto"

    return response.send(order)
})





app.listen(port, () => {
    console.log(`Server started on port ${port}👍`)
})