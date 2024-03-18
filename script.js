$(document).ready(function() {
  var jsonFile = 'data.json';

  // Function to fetch JSON data
  function fetchData() {
    $.getJSON(jsonFile, function(data) {
      // Iterate through JSON data and create Bootstrap cards
      $.each(data, function(index, item) {
        var cardHTML = `
          <div class="col-md-4 mb-4 col-lg-3">
            <div class="card">
              <img src="${item.album.images[1].url}" class="card-img-top" alt="${item.title}">
              <div class="card-body" style="height: 200px;">
                <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <h4 class="card-title">${item.name}</h4>
                    <p>
                      ${item.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                  <div>
                    <button class="btn btn-primary read-btn" data-playing="false" data-audio="${item.preview_url}">Play</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        // Append the card HTML to the card container
        $('#card-container').append(cardHTML);
      });
    });
  }

  // Call fetchData function to load JSON data and create cards
  fetchData();

  function playMusic(audioPath) {
      var audio = new Audio(audioPath);
      audio.play();
  }

  

});




