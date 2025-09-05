
document.addEventListener('DOMContentLoaded', function(){
  function summarizeTopic(title, subject){
    title = (title||'').trim();
    subject = subject||'';
    // small keyword-based summary generator (expandable)
    const lower = title.toLowerCase();
    if(lower.includes('grande') || lower.includes('grandezas')){
      return "Resumo: Neste tópico abordamos as grandezas físicas — conceitos de grandeza, unidade e medida — e a importância do Sistema Internacional (SI). Veremos como identificar grandezas fundamentais e derivadas, conversões entre unidades e procedimentos básicos de medição, com exemplos práticos para interpretar resultados com precisão.";
    }
    if(lower.includes('cinética') || lower.includes('movimento')){
      return "Resumo: Estudamos os conceitos fundamentais do movimento (cinemática) e da dinâmica: posição, velocidade, aceleração e as leis de Newton. O foco é modelar movimentos unidimensionais e resolver problemas usando equações do movimento e análise de forças.";
    }
    if(lower.includes('estrutura') && lower.includes('atomica')){
      return "Resumo: Este tópico cobre a estrutura atômica, modelos atômicos históricos e atuais, propriedades dos elétrons, prótons e nêutrons, e como esses modelos explicam propriedades químicas e padrões periódicos.";
    }
    if(lower.includes('ligação') || lower.includes('ligacoes')){
      return "Resumo: Abordaremos os tipos de ligação química (iônica, covalente, metálica), polaridade das moléculas, entalpia de ligação e como as ligações determinam propriedades físicas e químicas das substâncias.";
    }
    // generic summary fallback
    return "Resumo: Neste tópico apresentamos os conceitos principais, definições e exemplos práticos relacionados ao tema. O objetivo é fornecer uma visão clara e aplicável, frameworks para resolver exercícios e indicações de estudo para aprofundamento.";
  }

  function makePlayerHtml(title, subject){
    var query = encodeURIComponent(title + (subject?(' ' + subject):''));
    // Use YouTube embed attempting a search-based playlist (works in many embeds): listType=search&list=...
    var src = 'https://www.youtube.com/embed?listType=search&list=' + query;
    var html = '<div class="player-wrap"><iframe src="'+src+'" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe></div>';
    html += '<div class="topic-summary"><div class="topic-title">'+(title||'Vídeo sobre o tópico')+'</div><div class="topic-desc">'+ summarizeTopic(title, subject) +'</div></div>';
    return html;
  }

  // Insert player placeholder after first .topicos-estudo section if exists
  var sections = document.querySelectorAll('.topicos-estudo');
  var inserted = false;
  if(sections.length){
    sections.forEach(function(sec){
      if(!sec.querySelector('#topic-player')){
        var div = document.createElement('div');
        div.id = 'topic-player';
        div.style.display = 'none';
        sec.parentNode.insertBefore(div, sec.nextSibling);
        inserted = true;
      }
    });
  } else {
    // fallback: insert at end of main
    var main = document.querySelector('main') || document.body;
    if(!document.querySelector('#topic-player')){
      var div = document.createElement('div');
      div.id = 'topic-player';
      div.style.display = 'none';
      main.appendChild(div);
      inserted = true;
    }
  }

  // Attach click handlers to topic list items
  var lists = document.querySelectorAll('.topicos-modelo');
  lists.forEach(function(ul){
    ul.querySelectorAll('li').forEach(function(li){
      li.style.cursor = 'pointer';
      li.addEventListener('click', function(ev){
        // prevent if clicking an actual link inside
        if(ev.target.tagName.toLowerCase()==='a' && ev.target.href) return;
        var title = li.textContent || li.innerText || 'Tópico';
        title = title.replace(/\s+/g,' ').trim();
        // try to remove counts like "1 aulas"
        title = title.replace(/\d+\s*aulas?/i,'').trim();
        var subj = (document.querySelector('title')||{innerText:''}).innerText;
        var player = document.querySelector('#topic-player');
        if(!player) return;
        player.innerHTML = makePlayerHtml(title, subj);
        player.style.display = 'block';
        // scroll into view smoothly
        player.scrollIntoView({behavior:'smooth', block:'start'});
      });
    });
  });
});
