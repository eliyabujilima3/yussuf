// ================= TYPING EFFECT =================

let text = "Data Science Student";
let i = 0;

function typing(){

  if(i < text.length){

    document.getElementById("typing").innerHTML += text.charAt(i);

    i++;

    setTimeout(typing,100);

  }

}

typing();


// ================= DARK MODE =================

let darkBtn = document.getElementById("darkModeBtn");

darkBtn.onclick = function(){

  if(document.body.style.background == "white"){

      document.body.style.background = "#081b29";
      document.body.style.color = "white";

  }else{

      document.body.style.background = "white";
      document.body.style.color = "black";

  }

}


// ================= CONTACT FORM API =================

const CONTACT_API_CANDIDATES = [
  window.API_BASE ? `${window.API_BASE}/contact` : null,
  'http://127.0.0.1:5000/api/contact',
  'http://localhost:5000/api/contact',
  `${location.protocol}//${location.hostname}:5000/api/contact`
].filter(Boolean);

async function postContact(body) {
  let lastError = null;
  for (const candidate of CONTACT_API_CANDIDATES) {
    try {
      console.log('Trying contact API URL:', candidate);
      const response = await fetch(candidate, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      return { response, url: candidate };
    } catch (error) {
      lastError = error;
      console.warn(`Contact API failed: ${candidate}`, error);
    }
  }
  throw lastError;
}

document.getElementById("contactForm").addEventListener("submit", async function(e){

  e.preventDefault();

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const message = document.getElementById("contactMessage").value;
  const responseDiv = document.getElementById("responseMessage");

  // Clear previous messages
  responseDiv.innerHTML = "";
  responseDiv.style.color = "blue";
  responseDiv.innerHTML = "Sending...";

  try {
    const { response, url } = await postContact({
      name: name,
      email: email,
      message: message
    });

    const data = await response.json();
    console.log('Contact response', response.status, data, 'used URL', url);

    if(response.ok){
      responseDiv.style.color = "green";
      responseDiv.innerHTML = "✓ Message sent successfully!";
      document.getElementById("contactForm").reset();
    } else {
      responseDiv.style.color = "red";
      responseDiv.innerHTML = "✗ Error: " + data.error + " (status " + response.status + ")";
    }
  } catch(error){
    responseDiv.style.color = "red";
    responseDiv.innerHTML = "✗ Connection error: " + error.message;
    console.error("Error:", error);
  }

});
