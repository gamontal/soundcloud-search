chrome.omnibox.onInputChanged.addListener(function (query, suggest) {
  var clientId = '70dbe4d49232b596d30fb6c341646830';
  var baseUrl = 'https://api.soundcloud.com/';
  var url;

  if (query.charAt(0) === '/') {
    url = baseUrl + 'users.json?client_id=' + clientId + '&q=' + encodeURIComponent(query.substr(1));
    fetch(url).then(function (response) {
      response.json().then(function (data) {
        suggest(data.map(function (user) {
          var fullname;
          if (user.full_name === '') { fullname = ''; }
          else { fullname = '(' + user.full_name + ')'; }
          return {
            content: user.permalink_url,
            description: user.username + ' ' + fullname
          };
        }));
     });
   });
  } else {
      url = baseUrl + 'tracks.json?client_id=' + clientId + '&q=' + encodeURIComponent(query);
      fetch(url).then(function (response) {
        response.json().then(function (data) {
          suggest(data.map(function (track) {
            return {
              content: track.permalink_url,
              description: track.title + ' by ' + track.user.username
            };
          }));
       });
     });
   }
});

chrome.omnibox.onInputEntered.addListener(function (text) {
  chrome.tabs.getSelected(null, function (tab) {
    var url;
    if ((text.substr(0, 8) === 'https://') || (text.substr(0, 7) === 'http://')) {
      url = text;
    } else if (text.charAt(0) === '/') {
        text = text.substr(1);
        url = 'https://soundcloud.com/search?q=' + text;
    } else {
        url = 'https://soundcloud.com/search?q=' + text;
    }
    chrome.tabs.update(tab.id, {url: url});
  });
});
