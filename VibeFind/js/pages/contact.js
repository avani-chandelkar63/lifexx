window.VF=window.VF||{};
(function(VF){
  var U=VF.utils,C=VF.CONFIG,$=U.$,esc=U.esc;
  U.ready(function(){
    VF.chrome.mount('contact');
    var form=$('#suggestForm'),status=$('#formStatus'),copyBox=$('#copyBox'),copyText=$('#copyText'),copyBtn=$('#copyBtn'),mailBtn=$('#mailBtn');
    function payload(){
      var fd=new FormData(form);
      return [
        'VibeFind — Suggested place',
        'Name: '+(fd.get('name')||'').trim(),
        'Email: '+(fd.get('email')||'').trim(),
        'Place / venue: '+(fd.get('venue')||'').trim(),
        'City / region: '+(fd.get('region')||'').trim(),
        'Area: '+((fd.get('area')||'').trim()||'Not supplied'),
        'Link: '+((fd.get('link')||'').trim()||'Not supplied'),
        '',
        'Why should it be listed?',
        (fd.get('reason')||'').trim()
      ].join('\n');
    }
    function fallbackCopy(text){
      copyText.value=text;copyText.focus();copyText.select();
      try{return document.execCommand('copy')}catch(e){return false}
    }
    function setMail(text){
      if(C.contactEmail){
        var a=$('#mailBtn');a.href='mailto:'+encodeURIComponent(C.contactEmail)+'?subject='+encodeURIComponent('VibeFind venue suggestion')+'&body='+encodeURIComponent(text);a.hidden=false;
      }else mailBtn.hidden=true;
    }
    form.addEventListener('submit',function(e){
      e.preventDefault();
      if(!form.reportValidity()){status.textContent='Please complete the required fields.';return}
      var text=payload();
      copyBox.classList.add('is-visible');copyText.value=text;setMail(text);
      if(navigator.clipboard&&navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(function(){status.textContent='Your suggestion has been copied. Paste it into a message to the VibeFind team.'}).catch(function(){var ok=fallbackCopy(text);status.textContent=ok?'Your suggestion is ready to paste.':'Your message is shown below; select and copy it.'});
      }else{
        var ok=fallbackCopy(text);status.textContent=ok?'Your suggestion has been copied.':'Your message is shown below; select and copy it.';
      }
      copyBox.scrollIntoView({behavior:U.reduceMotion()?'auto':'smooth',block:'nearest'});
    });
    copyBtn.addEventListener('click',function(){
      var text=copyText.value;
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(text).then(function(){status.textContent='Copied again.'}).catch(function(){fallbackCopy(text);status.textContent='Select the message and copy it.'})}
      else{fallbackCopy(text);status.textContent='Select the message and copy it.'}
    });
    form.addEventListener('reset',function(){
      copyBox.classList.remove('is-visible');
      status.textContent='';
    });
    mailBtn.hidden=!C.contactEmail;
    VF.reveal.init();VF.cursor.init();VF.transitions.init();VF.polish.init();
  });
})(window.VF);
