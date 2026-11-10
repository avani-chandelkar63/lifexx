/* Image architecture. NO venue photos exist yet.
   - `categories`: designed scenes (generated SVG in js/ui/scenes.js) used as category art. They are never presented as a venue's photo.
   - `venues`: map of record id -> {src, alt, credit, license, verified:true}. Add real photos here later and cards pick them up automatically.
   Example:  'del-104': {src:'assets/photos/del-104.jpg', alt:'Arcade floor at ...', credit:'Photo: ...', license:'...', verified:true} */
window.VF=window.VF||{};
VF.PHOTOS={categories:{gaming:'scene',sports:'scene',thrill:'scene',adventure:'scene',art:'scene',interactive:'scene'},venues:{}};
