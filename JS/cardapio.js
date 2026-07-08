// Filtros do cardápio
document.querySelectorAll('.filtro-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filtro-btn').forEach(function(b){ b.classList.remove('ativo'); });
    btn.classList.add('ativo');
    var cat = btn.dataset.cat;
    document.querySelectorAll('.card-cardapio').forEach(function(card) {
      if (cat === 'todos' || card.dataset.cat === cat) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});
