const books = document.querySelectorAll("tr");
const body = document.querySelector("body");


function appendTableLinks(list) {
    let numberOfLinks = Math.ceil(list.length / 10);
    let paginationContainer = document.createElement("div");
    paginationContainer.className += "pagination";
    body.appendChild(paginationContainer);
 
    for(let i = 0; i < numberOfLinks; i++) {
       let listItem = document.createElement("li");
       let link = document.createElement("a");
 
       // set the first link to the active class initially.
       if (i === 0) {
          link.classList.add("active");
       }
 
       link.id = i;
       link.textContent = `${i + 1}`;
       listItem.appendChild(link);
       paginationContainer.appendChild(listItem);
    }
 
 }

 appendTableLinks(books);


 function showPage(list, page) {
    let startIndex = (page * 10) - 10;
    let endIndex = page * 10;
    for(let i = 1; i < list.length; i++) {
       list[i].style.display = 'none';
    }
 
    for(let j = startIndex; j < endIndex; j++) {
 
       if (j >= list.length) {
          break;
       }
 
       list[j].style.display = 'table-row';
    }
 }
 
 showPage(books, 1);


 const paginationDiv = document.querySelector(".pagination");

 paginationDiv.addEventListener("click", (e) => {

   let link = e.target;
   let links = document.querySelectorAll(".pagination li a");

   // Loop to find the current link with the active class and remove it.
   for (let i = 0; i < links.length; i++) {
      if (links[i].classList.contains("active")) {
         links[i].classList.remove("active");
      }
   }

   if (link.tagName === "A") {
      link.classList.add("active");
      showPage(books, parseInt(link.id) + 1);
   }
});