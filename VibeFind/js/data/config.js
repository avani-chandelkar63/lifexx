/* VibeFind configuration. Edit here, not in page HTML. */
window.VF=window.VF||{};
VF.CONFIG={
  siteName:'VibeFind',
  tagline:'Discover. Explore. Experience.',
  // Contact: leave null until a real team address exists. The contact page never invents a recipient.
  contactEmail:null,
  storage:{wishlist:'vibefind.wishlist.v1'},
  pages:{home:'index.html',explore:'explore.html',delhi:'delhi.html',tricity:'chandigarh.html',experience:'experience.html',about:'about.html',contact:'contact.html'},
  cities:{
    delhi:{key:'delhi',label:'Delhi',long:'Delhi NCT',page:'delhi.html',line:'Nine zones. Sixty-five neighbourhoods. One very large city of things to do.',coverage:'Selected venues collected for a student project. Not every venue in Delhi is listed.'},
    tricity:{key:'tricity',label:'Chandigarh Tricity',long:'Chandigarh · Mohali · Zirakpur · Panchkula',page:'chandigarh.html',line:'Four towns, three jurisdictions, one weekend circuit.',coverage:'Selected venues across Chandigarh UT, Mohali & Kharar, Zirakpur and Panchkula. Coverage is partial.'}
  },
  regions:{
    delhi:{label:'Delhi',city:'delhi'},
    chandigarh:{label:'Chandigarh',city:'tricity',jurisdiction:'Chandigarh UT'},
    mohali:{label:'Mohali & Kharar',city:'tricity',jurisdiction:'Punjab'},
    zirakpur:{label:'Zirakpur',city:'tricity',jurisdiction:'Punjab'},
    panchkula:{label:'Panchkula',city:'tricity',jurisdiction:'Haryana'}
  },
  // Category tags are the source tags, untouched. `scene` keys map to designed visuals in js/ui/scenes.js
  categories:{
    gaming:{label:'Gaming & Arcade',short:'Gaming',scene:'gaming',hue:'#A78BFA',line:'Cue tables, VR rigs, racing sims and arcades.'},
    sports:{label:'Sports',short:'Sports',scene:'sports',hue:'#C6FF4D',line:'Turf, courts, pools and complexes.'},
    thrill:{label:'Thrill & Puzzle',short:'Thrill',scene:'thrill',hue:'#8B5CF6',line:'Escape rooms and rage rooms.'},
    adventure:{label:'Adventure & High-Energy',short:'Adventure',scene:'adventure',hue:'#D6A84F',line:'Climb, jump, kart, paintball.'},
    art:{label:'Art & Creative Workshops',short:'Creative',scene:'art',hue:'#F5F5F5',line:'Pottery, resin, painting, craft.'},
    interactive:{label:'Interactive & Experiences',short:'Experiences',scene:'interactive',hue:'#A0A5B1',line:'Museums, illusions, gardens.'}
  },
  // Home page collections. Each is a rule over the dataset, so counts are always true.
  collections:[
    {id:'cue',title:'Cue Culture',blurb:'Snooker, pool and billiards tables.',filter:{sub:['snooker-pool']},scene:'gaming'},
    {id:'vr',title:'Step Into VR',blurb:'Headset arenas and VR rooms.',filter:{sub:['vr']},scene:'interactive'},
    {id:'racquet',title:'Racquet Sports',blurb:'Pickleball, padel, badminton, squash, tennis.',filter:{sub:['racquet']},scene:'sports'},
    {id:'escape',title:'Locked In',blurb:'Escape rooms and rage rooms.',filter:{sub:['escape-rooms','rage-room']},scene:'thrill'},
    {id:'clay',title:'Hands In Clay',blurb:'Pottery, resin and painting studios.',filter:{sub:['pottery-clay','resin-craft','painting-drawing']},scene:'art'},
    {id:'air',title:'Get Airborne',blurb:'Trampolines, climbing walls, ropes.',filter:{sub:['trampoline','climbing-ropes']},scene:'adventure'}
  ],
  pageSize:24
};
