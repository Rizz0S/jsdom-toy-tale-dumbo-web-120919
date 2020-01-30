let addToy = false

document.addEventListener("DOMContentLoaded", ()=>{

  //-------DOM-ELEMENTS----------//

  const addBtn = document.querySelector('#new-toy-btn')
  const toyForm = document.querySelector('.container')
  const toyList = document.querySelector('#toy-collection')

  //-------EVENT-LISTENERS----------//

  addBtn.addEventListener('click', () => {
    // hide & seek with the form
    addToy = !addToy
    if (addToy) {
      toyForm.style.display = 'block'
    } else {
      toyForm.style.display = 'none'
    }
  })

  toyForm.addEventListener("submit", handleFormSubmit)

  toyList.addEventListener('click', e => {
    if (e.target.className === "like-btn") {
      const outerLi = e.target.closest(".card")
      const likeCount = outerLi.querySelector(".like-count")
      const toyID = outerLi.dataset.id
      const updatedLikeCount = parseInt(likeCount.textContent) + 1
    

      fetch(`http://localhost:3000/toys/${toyID}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: updatedLikeCount
        })
      })
      likeCount.textContent = `${updatedLikeCount} Likes`

    }
  })

  //-------EVENT-HANDLERS----------//

  function handleFormSubmit(event) {
    // always prevent the default action for submit events!
    event.preventDefault()

    // get the form input
    const toyName = event.target["name"].value
    const toyImage = event.target["image"].value

    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0
    }

    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(newToy)
    })
      .then(r => r.json())
      .then(actualNewToy => {
        renderOneToy(actualNewToy)
      })
      toyForm.style.display = 'none'
      addToy = false
  }

  // function handleLikeButtonClick(event) {
  //   let likes = 
  // }
  //-------RENDER-HELPER----------//

  function renderOneToy(toyObj) {
    const outerLi = document.createElement('div')
    outerLi.className = "card"
    outerLi.dataset.id = toyObj.id
  
    outerLi.innerHTML = `
        <h2>${toyObj.name}</h2>
        <img src=${toyObj.image} class="toy-avatar" />
        <p class="like-count">${toyObj.likes} Likes</p>
        <button class="like-btn">Like <3</button>
      ` 
    toyList.append(outerLi)
  }
  
  function renderAllToys(toys) {
    toys.forEach(renderOneToy)
  }

  //-------INITIAL-RENDER----------//


  fetch("http://localhost:3000/toys")
  .then(r => r.json())
  .then(data => {
    renderAllToys(data)
  })


  
})
