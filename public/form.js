const socket = io()

const productsBody = document.getElementById('productsBody')


socket.on('products', data =>{

 console.log('vista del front')   
   const productos = data
    productos.forEach( (prod ,index) => {
        const productTemplate = `
         
         <tr>
         <th scope="row"><%= index +1%></th>
         <td><%=prod.title%></td>
         <td><%=prod.price%></td>
         <td><img src="<%=prod.thumbnail%>"></td>
         </tr>
    `
    productsBody.innerHTML += productTemplate
    })
})