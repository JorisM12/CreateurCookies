const affichage = document.querySelector('.affichage');
const btns = document.querySelectorAll('button');
const inputs = document.querySelectorAll('input');
const infoTxt =  document.querySelector('.info-txt');
let dejaFait = false;
const today = new Date();
// Ajouter 7 jours
const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
let day = ('0' + nextWeek).slice(9,11);
let month = ('0' + (today.getMonth() + 1)).slice(-2);
let year = today.getFullYear();
document.querySelector('input[type=date]').value = `${year}-${month}-${day}`;
btns.forEach(btn =>{
    btn.addEventListener('click',btnAction);
})
function btnAction(e) {
    let nvObjs = {};
    inputs.forEach(input => {
        let attrName = input.getAttribute('name');
        //Récuperer la valeur en format date JS
        let attrValeur =  attrName !== "cookieExpire" ? input.value : input.valueAsDate;
        nvObjs[attrName] = attrValeur;
    })
    let description = e.target.getAttribute('data-cookie');

    if(description === "creer") {
        creerCookie(nvObjs.cookieName, nvObjs.cookieValue, nvObjs.cookieExpire);
    }else if (description === "toutAfficher"){
        listeCookie();
    }
}
function creerCookie(name, value, exp) {
    infoTxt.innerText = "";
    affichage.innerHTML = "";  
    affichage.childNodes.forEach(child => {
        child.remove();
    })
    if(name.length === 0) {
        infoTxt.innerText = `Impossible de définir ce cookie`;
        return;
    } 
    let cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        cookie = cookie.trim();
        let formatCookie = cookie.split('=');
        if(formatCookie[0] === encodeURIComponent(name)) {
            dejaFait = true;

        }
    })
    if(dejaFait) {
        infoTxt.innerText = "Un cookie possède déjà ce nom!";
        dejaFait = false;
        return;
    }
    //Encoder les caractères espaces etc et les remplaces par des symboles
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)};expires=${exp.toUTCString()}`;
    let info = document.createElement('li');
    info.innerText = `Cookie ${name} créé.`;
    affichage.appendChild(info);
    setTimeout(() => {
        info.remove();
    },1500);

}
function listeCookie() {
    let cookies = document.cookie.split(";");
    if(cookies.join() === "") {
        infoTxt.innerText = "Pas de cookie(s) à afficher !"
        return;
    }
    cookies.forEach(cookie => {
        cookie = cookie.trim();
        let formatCookie =  cookie.split('=');
        let item = document.createElement('li');
        infoTxt.innerText = "Cliquez sur un cookie pour le supprimer.";
        item.innerText = `Nom : ${decodeURIComponent(formatCookie[0])}, Valeur : ${decodeURIComponent(formatCookie[1])}`;
        affichage.appendChild(item);

        item.addEventListener('click', () => {
            //Ajouter une date antérieur pour supprimer le cookie avec Date(0)
            document.cookie = `${formatCookie[0]}=; expires=${new Date(0)}`;
            item.innerText = `Cookie ${formatCookie[0]} supprimé`;
            setTimeout(() => {
                item.remove();
            }, 1000);
        })
    })
}