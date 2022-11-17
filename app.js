const url = "https://private-e05942-courses22.apiary-mock.com/courses"

async function getApi(url){
  const response = await fetch(url);

  const data = await response.json();
  console.log(data)

  buildHtml(data)
}

getApi(url)

function buildHtml(data){
  let courses = '';
  for(let course of data){
    courses +=
    `
    <div class="card border-success m-3" style="max-width: 18rem;">
      <div class="card-header bg-transparent border-success">Start date: ${course.next_start}</div>
        <div class="card-body">
          <h5 class="card-title" style="cursor:pointer">${course.title}</h5>
        </div>
      <div class="card-footer bg-transparent border-success">
        <a href="${course.url}">Details</a>
      </div>
    </div>
    `
    document.querySelector(".courses").innerHTML = courses
  }
  const cardTitles = document.querySelectorAll(".card-title")
  cardTitles.forEach((cardTitle) => {
    cardTitle.addEventListener("click", function(event){
      courseDetails(event.target.innerHTML)
    })
  })
}


async function courseDetails(courseName) {
  const response = await fetch(url);
  const data = await response.json();
  data.forEach((el)=>{
    if(el.title === courseName){
      getSlug(el)
    }
  })
}

async function getSlug(course){
  const response = await fetch(`${url}/${course.slug}`);
  const data = await response.json();
  console.log(data)

  var access_key = '78cc4202e5862e72f9a5acb5273d62a6';
  const ipRes = await fetch("https://api.ipify.org?format=json")
  const ipData = await ipRes.json();
  const res = await fetch(`http://api.ipstack.com/${ipData.ip}?access_key=${access_key}`)
  // american ip for testing 112.39.244.19
  const location_data = await res.json();
  let courseDetails = "";
  if(location_data.location.is_eu){
    data.prices.forEach((item) => {
      if(item.currency === 'eur'){
        courseDetails =   `
        <div class="card border-success m-3" style="max-width: 18rem;">
          <div class="card-header bg-transparent border-success">Start date: ${course.next_start}</div>
            <div class="card-body">
              <h5 class="card-title pe-auto">${course.title}</h5>
              <p class="card-text">${data.description}</p>
              <p class="card-text">${item.amount} ${item.currency}</p>
              <div id="next_start"></div>
            </div>
          <div class="card-footer bg-transparent border-success">
            <a href="${course.url}">Details</a>
          </div>
          <button id="back">Go back</button>
        </div>
        `
      }
    })
  }else{
    data.prices.forEach((item) => {
      if(item.currency === 'usd'){
        courseDetails =   `
        <div class="card border-success m-3" style="max-width: 18rem;">
          <div class="card-header bg-transparent border-success">Start date: ${course.next_start}</div>
            <div class="card-body">
              <h5 class="card-title pe-auto">${course.title}</h5>
              <p class="card-text">${data.description}</p>
              <p class="card-text">${item.amount} ${item.currency}</p>
              <div id="next_start"></div>
            </div>
          <div class="card-footer bg-transparent border-success">
            <a href="${course.url}">Details</a>
          </div>
          <button id="back">Go back</button>
        </div>
        `
      }})
  }
  document.querySelector(".courses").innerHTML = courseDetails
  document.querySelector("#back").addEventListener("click", function() {
    getApi(url)
  })
  let dateTemplate = `<h3>Next start dates: </h3>`
  data.start_dates.forEach((date) => {
     dateTemplate += `

    <p class="card-text">${date} </p>
    `

  })
  document.getElementById("next_start").innerHTML = dateTemplate;
}
