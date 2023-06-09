// let element = document.createElement('div')
// let attr = document.createAttribute('calss')
// let text = document.createTextNode('product one')
// element.setAttribute('calss', 'product')
// element.appendChild(text)
// document.body.appendChild(element)
let load = document.body.textContent = 'loading'
window.onload = () => {
    for (let i = 0; i < 100; i++) {
        let headDiv = document.createElement('div')
        let elementH1 = document.createElement('h1')
        let elementP = document.createElement('p')
        let textH1 = document.createTextNode(`product ${i + 1}`)
        let textP = document.createTextNode(`shirt  ${i + 1}`)
        elementH1.appendChild(textH1)
        elementP.appendChild(textP)
        headDiv.appendChild(elementH1)
        headDiv.appendChild(elementP)
        document.body.appendChild(headDiv)
    }
}
let name1 = document.querySelector('[name= "name"]')
let password = document.querySelector('[name= "password"]')

document.forms[0].onsubmit = (e) => {
    let userName = false
    let userPassword = false
    console.log(password.value.length)
    if (name1.value !== "")
        userName = true
    if (password.value !== "" && password.value.length <= 10) userPassword = true
    if (userName === false || userPassword === false) e.preventDefault()
}
