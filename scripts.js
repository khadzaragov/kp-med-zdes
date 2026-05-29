// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id.length>1){
      const el=document.querySelector(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth',block:'start'}); }
    }
  });
});

document.querySelectorAll('[data-case-slider]').forEach(slider=>{
  const track=slider.querySelector('.case-slider-track');
  const cards=[...track.querySelectorAll('.direction-card')];
  const prev=slider.querySelector('[data-slider-prev]');
  const next=slider.querySelector('[data-slider-next]');
  let index=0;
  let cloneCount=0;
  let isMoving=false;

  const visibleCount=()=>window.matchMedia('(max-width:640px)').matches ? 1 : 2;
  const getRealIndex=()=>((index-cloneCount)%cards.length+cards.length)%cards.length;

  const setPosition=(animate=true)=>{
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    const step=cards[0].getBoundingClientRect().width+gap;
    track.style.transition=animate ? '' : 'none';
    track.style.transform=`translateX(${-index*step}px)`;
    if(!animate){
      track.offsetHeight;
      track.style.transition='';
    }
  };

  const createClone=(card)=>{
    const clone=card.cloneNode(true);
    clone.dataset.clone='true';
    clone.setAttribute('aria-hidden','true');
    return clone;
  };

  const buildLoop=(keepPosition=false)=>{
    const realIndex=keepPosition ? getRealIndex() : 0;
    track.querySelectorAll('[data-clone]').forEach(clone=>clone.remove());
    cloneCount=Math.min(visibleCount(),cards.length);

    const before=document.createDocumentFragment();
    cards.slice(-cloneCount).forEach(card=>before.appendChild(createClone(card)));
    track.insertBefore(before,track.firstChild);

    const after=document.createDocumentFragment();
    cards.slice(0,cloneCount).forEach(card=>after.appendChild(createClone(card)));
    track.appendChild(after);

    index=cloneCount+realIndex;
    setPosition(false);
  };

  const move=(direction)=>{
    if(isMoving || cards.length<2) return;
    isMoving=true;
    index+=direction;
    setPosition();
  };

  track.addEventListener('transitionend',()=>{
    isMoving=false;
    if(index>=cards.length+cloneCount){
      index=cloneCount;
      setPosition(false);
    }
    if(index<cloneCount){
      index=cards.length+cloneCount-1;
      setPosition(false);
    }
  });

  prev.addEventListener('click',()=>move(-1));
  next.addEventListener('click',()=>move(1));
  window.addEventListener('resize',()=>buildLoop(true));
  buildLoop();
});
