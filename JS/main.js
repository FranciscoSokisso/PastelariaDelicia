/* =============================================
   PASTELARIA DELÍCIA — main.js
   Funcionalidades: menu responsivo, voltar ao topo,
   dark mode, carrossel, validação de formulário,
   mapa Google Maps
   ============================================= */

/* ---- 1. MENU RESPONSIVO ---- */
function iniciarMenuResponsivo() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', function () {
    const aberto = navLinks.classList.toggle('nav-aberto');
    hamburger.setAttribute('aria-expanded', aberto);
    hamburger.innerHTML = aberto ? '&#10005;' : '&#9776;';
  });

  // Fechar menu ao clicar num link
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('nav-aberto');
      hamburger.innerHTML = '&#9776;';
      hamburger.setAttribute('aria-expanded', false);
    });
  });
}

/* ---- 2. BOTÃO VOLTAR AO TOPO ---- */
function iniciarBotaoTopo() {
  var btn = document.getElementById('btn-topo');
  if (!btn) return;

  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      btn.style.display = 'flex';
    } else {
      btn.style.display = 'none';
    }
  });

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---- 3. DARK MODE ---- */
function iniciarDarkMode() {
  var toggle = document.getElementById('dark-toggle');
  if (!toggle) return;

  // Recuperar preferência guardada
  var modoGuardado = localStorage.getItem('darkMode');
  if (modoGuardado === 'ativo') {
    document.body.classList.add('dark-mode');
    toggle.innerHTML = '☀️';
    toggle.title = 'Modo claro';
  }

  toggle.addEventListener('click', function () {
    var ativo = document.body.classList.toggle('dark-mode');
    if (ativo) {
      localStorage.setItem('darkMode', 'ativo');
      toggle.innerHTML = '☀️';
      toggle.title = 'Modo claro';
    } else {
      localStorage.setItem('darkMode', 'inativo');
      toggle.innerHTML = '🌙';
      toggle.title = 'Modo escuro';
    }
  });
}

/* ---- 4. CARROSSEL / SLIDER ---- */
function iniciarCarrossel() {
  var slides = document.querySelectorAll('.slide');
  if (slides.length === 0) return;

  var indiceAtual = 0;
  var total = slides.length;
  var intervalo;

  function mostrarSlide(indice) {
    slides.forEach(function (s) { s.classList.remove('slide-ativo'); });
    var pontos = document.querySelectorAll('.ponto');
    pontos.forEach(function (p) { p.classList.remove('ponto-ativo'); });

    indiceAtual = (indice + total) % total;
    slides[indiceAtual].classList.add('slide-ativo');
    if (pontos[indiceAtual]) pontos[indiceAtual].classList.add('ponto-ativo');
  }

  function proximoSlide() { mostrarSlide(indiceAtual + 1); }
  function slideAnterior() { mostrarSlide(indiceAtual - 1); }

  // Autoplay
  function iniciarAutoplay() {
    intervalo = setInterval(proximoSlide, 4000);
  }
  function pararAutoplay() {
    clearInterval(intervalo);
  }

  // Botões
  var btnProximo = document.getElementById('slide-proximo');
  var btnAnterior = document.getElementById('slide-anterior');
  if (btnProximo) btnProximo.addEventListener('click', function () { pararAutoplay(); proximoSlide(); iniciarAutoplay(); });
  if (btnAnterior) btnAnterior.addEventListener('click', function () { pararAutoplay(); slideAnterior(); iniciarAutoplay(); });

  // Pontos de navegação
  document.querySelectorAll('.ponto').forEach(function (ponto, i) {
    ponto.addEventListener('click', function () {
      pararAutoplay();
      mostrarSlide(i);
      iniciarAutoplay();
    });
  });

  // Swipe (telemóvel)
  var carrossel = document.getElementById('carrossel');
  if (carrossel) {
    var xInicio = 0;
    carrossel.addEventListener('touchstart', function (e) { xInicio = e.touches[0].clientX; });
    carrossel.addEventListener('touchend', function (e) {
      var diff = xInicio - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        pararAutoplay();
        diff > 0 ? proximoSlide() : slideAnterior();
        iniciarAutoplay();
      }
    });
  }

  mostrarSlide(0);
  iniciarAutoplay();
}

/* ---- 5. VALIDAÇÃO DE FORMULÁRIO (funções próprias) ---- */

function validarNome(valor) {
  if (!valor || valor.trim().length < 2) {
    return 'O nome deve ter pelo menos 2 caracteres.';
  }
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(valor.trim())) {
    return 'O nome não pode conter números ou símbolos.';
  }
  return '';
}

function validarEmail(valor) {
  if (!valor || valor.trim() === '') {
    return 'O email é obrigatório.';
  }
  // Padrão básico: algo@algo.algo
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(valor.trim())) {
    return 'Introduza um email válido (ex: nome@email.com).';
  }
  return '';
}

function validarTelefone(valor) {
  var apenas = valor.replace(/\D/g, '');
  if (apenas.length < 7) {
    return 'O telemóvel deve ter pelo menos 7 dígitos.';
  }
  return '';
}

function validarMensagem(valor) {
  if (!valor || valor.trim().length < 10) {
    return 'A mensagem deve ter pelo menos 10 caracteres.';
  }
  return '';
}

function mostrarErro(inputId, erroId, mensagem) {
  var input = document.getElementById(inputId);
  var erro = document.getElementById(erroId);
  if (!input || !erro) return;
  if (mensagem) {
    erro.textContent = mensagem;
    erro.style.display = 'block';
    input.classList.add('input-erro');
  } else {
    erro.textContent = '';
    erro.style.display = 'none';
    input.classList.remove('input-erro');
  }
}

function iniciarValidacaoFormulario() {
  var form = document.getElementById('form-contacto');
  if (!form) return;

  // Validação em tempo real
  var campos = [
    { id: 'campo-nome', erroId: 'erro-nome', fn: validarNome },
    { id: 'campo-email', erroId: 'erro-email', fn: validarEmail },
    { id: 'campo-tel', erroId: 'erro-tel', fn: validarTelefone },
    { id: 'campo-mensagem', erroId: 'erro-mensagem', fn: validarMensagem },
  ];

  campos.forEach(function (c) {
    var el = document.getElementById(c.id);
    if (!el) return;
    el.addEventListener('blur', function () {
      mostrarErro(c.id, c.erroId, c.fn(el.value));
    });
    el.addEventListener('input', function () {
      if (el.classList.contains('input-erro')) {
        mostrarErro(c.id, c.erroId, c.fn(el.value));
      }
    });
  });

  // Submissão
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valido = true;

    campos.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (!el) return;
      var msg = c.fn(el.value);
      mostrarErro(c.id, c.erroId, msg);
      if (msg) valido = false;
    });

    if (valido) {
      var sucesso = document.getElementById('form-sucesso');
      if (sucesso) {
        sucesso.style.display = 'block';
        form.reset();
        setTimeout(function () { sucesso.style.display = 'none'; }, 5000);
      }
    }
  });
}

/* ---- 6. MAPA GOOGLE MAPS ---- */
function iniciarMapa() {
  var mapaDiv = document.getElementById('mapa-google');
  if (!mapaDiv) return;

  // Coordenadas de exemplo — Luanda (ajustar conforme localização real)
  var lat = -8.8390;
  var lng = 13.2894;

  // Verificar se a API do Maps foi carregada
  if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
    mapaDiv.innerHTML = '<p style="text-align:center;padding:20px;">Mapa não disponível. Configure a sua chave da API Google Maps.</p>';
    return;
  }

  var mapa = new google.maps.Map(mapaDiv, {
    center: { lat: lat, lng: lng },
    zoom: 15,
  });

  new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: mapa,
    title: 'Pastelaria Delícia',
  });
}

/* ---- INIT: chamar tudo quando o DOM estiver pronto ---- */
document.addEventListener('DOMContentLoaded', function () {
  iniciarMenuResponsivo();
  iniciarBotaoTopo();
  iniciarDarkMode();
  iniciarCarrossel();
  iniciarValidacaoFormulario();
  // iniciarMapa() é chamada pelo callback da API Google Maps
});

/* ---- 7. HEADER SCROLL EFFECT ---- */
function iniciarHeaderScroll() {
  var header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 24px rgba(28,10,7,0.12)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

/* ---- 8. ANIMAÇÃO DE ENTRADA NOS CARDS ---- */
function iniciarAnimacaoCards() {
  if (!('IntersectionObserver' in window)) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  var cards = document.querySelectorAll('.card-servico, .card-produto, .card-testemunho, .card-cardapio, .card-valor');
  cards.forEach(function(card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.5s ease ' + (i * 0.08) + 's, transform 0.5s ease ' + (i * 0.08) + 's';
    observer.observe(card);
  });
}

document.addEventListener('DOMContentLoaded', function () {
  iniciarHeaderScroll();
  iniciarAnimacaoCards();
});
