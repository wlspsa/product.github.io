async function getServices() {
    try {
        //get data from server
        const response = await fetch("/api")
        const data = await response.json()
        const services = data.catbox_services
        console.log(services)

        //add services to DOM
        const serviceList = document.querySelector(".serviceList")
        for (let serviceData of services) {
            let service = document.createElement("div")
            serviceList.appendChild(service)
            service.classList.add("serviceBox")
            service.innerHTML = `<h2>${serviceData.product_name}</h2><p>$${serviceData.price}</p>`
        }
    } catch (err) {
        console.log(err)
    }
}
getServices()

//Hamburger menu
const hamburgijr = document.querySelector(".burgerMenu")
const hamburgi = document.querySelector(".burgerButton")
hamburgijr.classList.add("burgerGoAway")
hamburgi.addEventListener("click", () => {
    hamburgijr.classList.toggle("burgerGoAway")
})