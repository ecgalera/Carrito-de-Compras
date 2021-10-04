const cards = document.getElementById("cards") //donde ubico la card
const items = document.getElementById("items")
const footer = document.getElementById("template-footer")
const templateCard = document.getElementById("template-card").content // la card
const templateFooter = document.getElementById("template-footer").content 
const templateCarrito = document.getElementById("template-carrito").content
const fragment =document.createDocumentFragment()
// creamos un objeto vació para crear el carrito donde voy a meter los datos del objeto a crear
let carrito ={}

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
        console.log(carrito)
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

    }

