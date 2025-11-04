// Theme toggle, reveal on scroll, carousel with autoplay and manual nav, placeholder replacements
document.addEventListener('DOMContentLoaded', function(){
  // Theme toggle
  //const themeToggle = document.getElementById('theme-toggle');
  //themeToggle.addEventListener('click', ()=> document.body.classList.toggle('dark-mode'));

  // Reveal on scroll (simple)
  const reveals = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting) e.target.classList.add('show');
    });
  }, {threshold: 0.12});
  reveals.forEach(r=>obs.observe(r));

  // Simple carousel
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.slide');
  const prev = document.querySelector('.carousel-btn.prev');
  const next = document.querySelector('.carousel-btn.next');
  const dotsWrap = document.querySelector('.carousel-dots');
  let index = 0;
  let autoplay = true;
  let interval = 4000;
  let timer = null;

  // create dots
  slides.forEach((s,i)=>{
    const d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('aria-label','Go to slide '+(i+1));
    d.addEventListener('click', ()=>{ goTo(i); resetTimer(); });
    dotsWrap.appendChild(d);
  });

  function updateDots(){
    const dots = dotsWrap.querySelectorAll('.dot');
    dots.forEach((d,i)=> d.classList.toggle('active', i===index));
  }

  function goTo(i){
    if(i<0) i = slides.length-1;
    if(i>=slides.length) i = 0;
    index = i;
    track.style.transform = 'translateX(-'+(index*100)+'%)';
    updateDots();
  }
  prev.addEventListener('click', ()=>{ goTo(index-1); resetTimer(); });
  next.addEventListener('click', ()=>{ goTo(index+1); resetTimer(); });

  function startTimer(){
    if(timer) clearInterval(timer);
    timer = setInterval(()=>{ goTo(index+1); }, interval);
  }
  function resetTimer(){ if(autoplay) startTimer(); }
  if(autoplay) startTimer();
  updateDots();
  

	function formatPhoneNumber(phone) {
	  // Remove country code if present (assumes "55" for Brazil)
	  if (phone.startsWith("55")) {
		phone = phone.slice(2);
	  }

	  // Extract parts
	  const ddd = phone.slice(0, 2);         // Area code
	  const prefix = phone.slice(2, 7);      // First 5 digits
	  const suffix = phone.slice(7);         // Last 4 digits

	  // Format as (XX) XXXXX-XXXX
	  return `(${ddd}) ${prefix}-${suffix}`;
	}
  

  // Placeholder replacement hook (for easy editing later)
  window.replacePlaceholders = function(opts){
    // opts: { phone, whatsappMessage, mapEmbedUrl, contatoUrl, avaliacaoUrl, logoSrc }
    if(opts.phone){
      document.querySelectorAll('a[href^="https://wa.me/"]').forEach(a=>{
        a.href = 'https://wa.me/'+opts.phone + (opts.whatsappMessage ? '?text='+encodeURIComponent(opts.whatsappMessage) : '');
      });
      const phoneNode = document.getElementById('whatsapp-number');
      if(phoneNode) {
		  phoneNode.href = 'https://wa.me/'+opts.phone;
		  phoneNode.textContent = formatPhoneNumber(opts.phone);
	  }
    }
    if(opts.email){
      document.querySelectorAll('a[href^="mailto:"]').forEach(a=>{
        a.href = 'mailto:' + opts.email;
      });
      const emailNode = document.getElementById('email');
      if(emailNode) {
		  emailNode.href = 'mailto:' + opts.email;
		  emailNode.textContent = opts.email;
	  }
    }
    if(opts.mapEmbedUrl){
      document.querySelectorAll('iframe[src*="PLACEHOLDER_MAP_EMBED"]').forEach(f=> f.src = opts.mapEmbedUrl);
    }
    if(opts.avaliacaoUrl){
      document.getElementById('btn-agendar').href = opts.avaliacaoUrl;
    }
    if(opts.contatoUrl){
      document.querySelectorAll('a[href="https://example.com/contato"]').forEach(a=> a.href = opts.contatoUrl);
    }
    if(opts.logoSrc){
      document.querySelectorAll('img.logo').forEach(img=> img.src = opts.logoSrc);
    }
  };

  if (window.LANDING_CONFIG) {
    window.replacePlaceholders(window.LANDING_CONFIG);
  }

});

