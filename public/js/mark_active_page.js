// Remove the activ class from any elements there are.
var toRemove = document.getElementsByClassName("active")[0];
toRemove.classList.remove("active");

//Parse the URL to get the page we are at
var activ = document.URL;
var activ = activ.split('/')[3];

//Add active class to the current page meniu element
if (activ == "bazadate") {
    var toAdd = document.getElementById("bazadate");
    toAdd.classList.add("active");
} else if (activ == "meniu") {
    var toAdd = document.getElementById("meniu");
    toAdd.classList.add("active");
} else if (activ == "paginaGrid") {
    var toAdd = document.getElementById("grid");
    toAdd.classList.add("active");
} else {
    var toAdd = document.getElementById("acasa");
    toAdd.classList.add("active");
}