const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener("DOMContentLoaded", ()=>fetchData())
//dentro de los cards agregamos el evento e= captura el elemento que queremos modificar
cards.addEventListener("click", e=>{
    addCarrito(e) 
})

const fetchData = async()=>{
    try{
        const res = await fetch("api.json")
        const data = await res.json()
        // console.log(data)
        pintarCards(data) // la función de abajo la ejecuto y le paso los datos
    }catch (error){console.log("Error")}
}

 const pintarCards = data =>{
     data.forEach(producto => { // tenemos que recorrer los datos con forEach
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.precio 
        //cargo la imagen y como no tiene el atributo se lo fijo con setAttribute(name, atributo)
        templateCard.querySelector("img").setAttribute("src", producto.thumbnailUrl)
        // al boton le agregamos el id del producto de manera dinamica con js
        templateCard.querySelector(".btn-dark").dataset.id = producto.id
       //dataset.id es la manera colocar el numero del producto al boton correspondiente
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)

     });
        cards.appendChild(fragment)
 }

  const addCarrito = e => { 
    //   console.log(e.target)
      // capturo el evento que tiene la clase que yo quiero y verifico que sea el que quiero
    //   console.log(e.target.classList.contains("btn-dark"))
      if(e.target.classList.contains("btn-dark")){
          setCarrito(e.target.parentElement) // traigo la informacion de div toda la informacion
              // mandamos el elemento padre a setCarrito
      }
      e.stopPropagation() // detiene cualquier otro evente que se pueda generar en nuestro cards 
    }

    const setCarrito = objeto => {
            // console.log(objeto)
            const producto =
            {
                id:objeto.querySelector(".btn-dark").dataset.id,
                title:objeto.querySelector("h5").textContent,
                precio:objeto.querySelector("p").textContent,
                cantidad: 1,
                
            }

            if(carrito.hasOwnProperty(producto.id)){
                producto.cantidad = carrito[producto.id].cantidad + 1
            }

            carrito[producto.id]= {...producto}
               pintarCarrito()
    }

    const pintarCarrito = ()=>{
        items.innerHTML = " " // así lo limpiamos despues de cada selección 
        // console.log(carrito)
        Object.values(carrito).forEach(producto =>{
            templateCarrito.querySelector("th").textContent = producto.id
            templateCarrito.querySelectorAll("td")[0].textContent = producto.title
            templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
            templateCarrito.querySelector(".btn-info").dataset.id = producto.id
            templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
            templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio

            const clone = templateCarrito.cloneNode(true)
            fragment.appendChild(clone)
        })

        items.appendChild(fragment)

        pintarFooter()

    }

 // vamos a pintar el footer 
 const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
        `
        return
    }
    
    // sumar cantidad y sumar totales
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)
    // console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })

}

const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}
    



