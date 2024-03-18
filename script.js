$(document).ready(function() {
  var jsonFile = 'data.json';
  var audioObjects = []; // Array to store references to Audio objects

  function fetchData() {
    $.getJSON(jsonFile, function(data) {
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
        $('#card-container').append(cardHTML);
      });
      
      $('.read-btn').on('click', function() {
        var audioUrl = $(this).data('audio');
        var isPlaying = $(this).data('playing');
        
        $('.read-btn').each(function() {
          $(this).html('Play');
          $(this).data('playing', false);
        });

        if (isPlaying) {
          $(this).html('Play');
          $(this).data('playing', false);
          stopAllAudio();
        } else {
          $(this).html('Pause');
          $(this).data('playing', true);
          playAudio(audioUrl);
        }
      });
    });
  }

  function stopAllAudio() {
    audioObjects.forEach(function(audio) {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  function playAudio(audioUrl) {
    var audio = new Audio(audioUrl);
    audioObjects.push(audio); // Ajouter l'objet Audio au tableau
    audio.play();
    audio.onended = function() {
      $('.read-btn').each(function() {
        $(this).html('Play');
        $(this).data('playing', false);
      });
    };
  }
  fetchData();
});
