$(document).ready(function() {
  var jsonFile = 'data.json';
  var audioObjects = []; // Tableau pour stocker les références aux objets Audio

  function fetchData() {
    $.getJSON(jsonFile, function(data) {
      $.each(data, function(index, item) {
        var cardHTML = `
          <div class="col-md-4 mb-4 col-lg-3">
            <div class="card">
              <img src="${item.album.images[1].url}" class="card-img-top" alt="${item.title}">
              <div class="card-body" style="height: 220px;">
                <div style="height: 100%; display: flex; flex-direction: column; justify-content: space-between;">
                  <div>
                    <h4 class="card-title">${item.name}</h4>
                    <p>
                      ${item.artists.map((artist) => artist.name).join(", ")}
                    </p>
                  </div>
                  <div>
                    <progress id="audioProgress_${index}" value="0" max="100"></progress> <!-- Barre de progression -->
                    <span id="currentTime_${index}">0:00</span> <!-- Timecode -->
                    <button class="btn btn-primary read-btn" data-playing="false" data-audio="${item.preview_url}">Play</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        $('#card-container').append(cardHTML);
      });
      
      // Event listener pour les boutons play/pause 
      $('.read-btn').on('click', function() {
        var audioUrl = $(this).data('audio');
        var isPlaying = $(this).data('playing');
        var progressElement = $(this).siblings('progress'); // Sélectionnerla barre de progression
        
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
          playAudio(audioUrl, progressElement);
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

  function playAudio(audioUrl, progressElement) {
    var audio = new Audio(audioUrl);
    audioObjects.push(audio); // Ajouter l'objet Audio au tableau
    audio.play();
    audio.onended = function() {
      $('.read-btn').each(function() {
        $(this).html('Play');
        $(this).data('playing', false);
      });
    };

    // Mise à jour de la progression de l'audio
    audio.ontimeupdate = function() {
      var progress = (audio.currentTime / audio.duration) * 100;
      progressElement.val(progress);
      
      // Mettre à jour le timecode
      var currentTime = formatTime(audio.currentTime);
      var totalTime = formatTime(audio.duration);
      var index = progressElement.attr('id').split('_')[1];
      $('#currentTime_' + index).text(currentTime);
      $('#totalTime_' + index).text(totalTime);
    };
  }
  
  // Fonction pour formater le temps (en secondes) en format mm:ss
  function formatTime(seconds) {
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    return minutes + ':' + (remainingSeconds < 10 ? '0' : '') + remainingSeconds;
  }
  

  fetchData();

  
  $(document).ready(function() {
    $.getJSON('data.json', function(data) {
        var totalEcoutesParArtiste = {};

        // Calculer le nombre total d'écoutes de chaque artiste à partir de la popularité
        data.forEach(function(item) {
            var artistName = item.artists[0].name;
            var popularity = item.artists[0].popularity;

            var ecoutes = Math.round(popularity * 10); // Exemple de calcul simple

            // Mettre à jour le total des écoutes de l'artiste
            if (totalEcoutesParArtiste[artistName] === undefined) {
                totalEcoutesParArtiste[artistName] = ecoutes;
            } else {
                totalEcoutesParArtiste[artistName] += ecoutes;
            }
        });

        // Extraire les labels (artistes) et les données (écoutes)
        var labels = Object.keys(totalEcoutesParArtiste);
        var ecoutes = Object.values(totalEcoutesParArtiste);

        // Configuration du graphique
        var config = {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Nombre d\'écoutes',
                    data: ecoutes,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };

        

        // Création du graphique
        var ctx = document.getElementById('MyChart').getContext('2d');
        var myChart = new Chart(ctx, config);
        
        $(document).ready(function() {
          $.getJSON('data.json', function(data) {
            var totalEcoutesParArtiste = {};
        
            // Calculer le nombre total d'écoutes de chaque artiste à partir de la popularité
            data.forEach(function(item) {
              var artistName = item.artists[0].name;
              var popularity = item.artists[0].popularity;
        
              var ecoutes = Math.round(popularity * 10); // Exemple de calcul simple
        
              // Mettre à jour le total des écoutes de l'artiste
              if (totalEcoutesParArtiste[artistName] === undefined) {
                totalEcoutesParArtiste[artistName] = ecoutes;
              } else {
                totalEcoutesParArtiste[artistName] += ecoutes;
              }
            });
        
            // Trier les artistes par le nombre d'écoutes (du plus grand au plus petit)
            var sortedArtists = Object.keys(totalEcoutesParArtiste).sort(function(a, b) {
              return totalEcoutesParArtiste[b] - totalEcoutesParArtiste[a];
            });
        
            // Sélectionner les 10 premiers artistes
            var top10Artists = sortedArtists.slice(0, 10);
            var top10Data = top10Artists.map(function(artist, index) {
              // Ajouter le classement au nom de l'artiste
              var rankedArtist = (index + 1) + '. ' + artist;
              return {
                artist: rankedArtist,
                ecoutes: totalEcoutesParArtiste[artist]
              };
            });
        
            // Extraire les labels (artistes) et les données (écoutes)
            var labels = top10Data.map(function(item) {
              return item.artist;
            });
            var ecoutes = top10Data.map(function(item) {
              return item.ecoutes;
            });
        
            // Configuration du graphique en forme de doughnut
            var doughnutConfig = {
              type: 'doughnut',
              data: {
                labels: labels,
                datasets: [{
                  label: 'Top 10 Artistes',
                  data: ecoutes,
                  backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)'
                  ],
                  borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)'
                  ],
                  borderWidth: 1
                }]
              },
              options: {
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }
            };
        
            // Création du graphique en forme de doughnut
            var doughnutCtx = document.getElementById('myDonutChart').getContext('2d');
            var myDoughnutChart = new Chart(doughnutCtx, doughnutConfig);
          });
        });
      });
     
    });
});







