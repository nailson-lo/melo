var timeline = document.getElementById('timeline'), speaking, swiper, pontos = [];

let tlAddCard = (title, body) => {
  timeline.innerHTML +=
    '<div class="swiper-slide">' +
    '<div class="slide-content">' +
    '<h2 class="slide-title"><span class="inner-title">' + title + '</span><ion-icon class="speaker" name="mic-circle"></ion-icon></h2>' +
    '<div class="slide-content-bottom">' + body + '</div>' +
    '</div>' +
    '</div>';
}

let carregar_timeline = (file) =>
  fetch(file)
  .then((response) => response.json())
  .then((json) => json.forEach(li => tlAddCard(li.title, li.body)))
  .then(() => start_swiper())

let start_swiper = () => {
  swiper = new Swiper("#swiper", {
    effect: "coverflow",
    grabCursor: true,
    centeredSlides: true,
    slidesPerView:"auto",
    coverflowEffect: {
      rotate: 0,
      stretch: 0,
      depth: 100,
      modifier: 4.5,
      slideShadows: true,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    }
  });
  swiper.on('slideChange', () => document.body.classList.contains('speaking') ? stopSpeach() : '');
}

(timeline === null) || (timeline.onclick = (evt) => {
  if (evt.target.classList.contains('speaker')) {
    if (document.body.classList.contains('speaking')) return stopSpeach();
    document.body.classList.add('speaking');
    context = evt.target.closest('.slide-content');
    text = context.getElementsByClassName('inner-title')[0].innerHTML
      + "\n\n"
      + context.getElementsByClassName('slide-content-bottom')[0].innerHTML.replaceAll('am-se', 'ãosse').replaceAll('</p>', '.</p>');
    speak(text);
  }
})

let load_points = () =>
fetch('../dados/pontos.json')
.then((response) => response.json())
.then((json) => pontos = json);

load_points();

let closest_point = (lat, lon) => {
  let num = Math.pow(lat, 2) + Math.pow(lon, 2), min = Math.abs(pontos[0].sum - num), closest = 0;
  pontos[0].diff = Math.abs(num - pontos[0].sum);
  for (i = 1; i < pontos.length; i++)
  {
    pontos[i].diff = Math.abs(num - pontos[i].sum);
    if (pontos[i].diff < min)
    {
      min = Math.abs(num - pontos[i].sum);
      closest = i;
    }
  }

  //console.log(num,  lat, lon);
  alertify.confirm(
    'Ponto mais próximo encontrado:',
    '<p class="center"><b>'+ pontos[closest].title + '</b></p>',
    () => location.href = 'paginas/'+ pontos[closest].point + '.html',
    () => location.href = pontos[closest].directions,
  )
  .set('labels', {ok: pontos[closest].subtitle, cancel: '<ion-icon name="map"></ion-icon> Rota para o local'})
  .set({invokeOnCloseOff: true});
}

let localizar = () =>
{
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(localizarPonto, noLocationAuth, {enableHighAccuracy: true});
  }
}

let localizarPonto = (location) => 
{
  closest_point(location.coords.latitude, location.coords.longitude);
}

function noLocationAuth(error) {
  alert('Autorize o compartilhamento de localização para usar este recurso, ou siga a navegação virtual!');
  console.log(error);
}

let escolher_ponto = () => {
  let html = '';
  pontos.forEach((p) => html += '<h3 class="point-title"><a href="/paginas/'+ p.point +'.html">'+ p.title +': '+ p.subtitle  +'</h3>');
  alertify.alert('Selecione um ponto', html)
}

let fontes = () => {
  alertify.alert(
    'Fontes:',
    '<h3 style="margin-bottom:20px;">Todas as informações dispostas neste sítio eletrônico tem como origem uma ou mais dentre as seguintes fontes:</h3>'+
    '<ul style="margin-bottom:20px;list-style-type:bullet">'+
      '<li>Portal da UFC</li>'+
      '<li>Memorial da UFC</li>'+
      '<li>Sítio da STI</li>'+
      '<li>Sítio do Centro de Ciências</li>'+
    '</ul>'+
    '<p>Estamos abertos à revisão colaborativa, de forma a tornar a informação cada vez mais útil e precisa.</p>'
  )
}

let nav_share = () => {
  data = {
    'title': 'Memória da UFC',
    'text': document.title,
    'url': location.href
  };
  if (navigator.canShare && navigator.canShare(data)) {
    navigator.share(data);
  }
}