(this["webpackJsonppart2-lesson"]=this["webpackJsonppart2-lesson"]||[]).push([[0],{15:function(t,e,n){t.exports=n(38)},37:function(t,e,n){},38:function(t,e,n){"use strict";n.r(e);var a=n(0),r=n.n(a),o=n(13),c=n.n(o),u=n(14),i=n(3),l=function(t){var e=t.note,n=t.toggleImportance,a=e.important?"make not important":"make important";return r.a.createElement("li",{className:"note"},e.content,r.a.createElement("button",{onClick:n},a))},m=function(t){var e=t.message;return e?r.a.createElement("div",{className:"error"},e):null},s=n(2),p=n.n(s),f="https://dry-cove-65105.herokuapp.com/notes",d=function(){return p.a.get(f).then((function(t){return t.data}))},h=function(t){return p.a.post(f,t).then((function(t){return t.data}))},b=function(t,e){return p.a.put("".concat(f,"/").concat(t),e).then((function(t){return t.data}))},v=function(t){var e=Object(a.useState)([]),n=Object(i.a)(e,2),o=n[0],c=n[1],s=Object(a.useState)(""),p=Object(i.a)(s,2),f=p[0],v=p[1],E=Object(a.useState)(!0),g=Object(i.a)(E,2),O=g[0],j=g[1],y=Object(a.useState)(""),k=Object(i.a)(y,2),S=k[0],N=k[1];Object(a.useEffect)((function(){d().then((function(t){c(t)}))}),[]);var I=O?o:o.filter((function(t){return!0===t.important}));return r.a.createElement("div",null,r.a.createElement("h1",null,"Notes"),r.a.createElement(m,{message:S}),r.a.createElement("div",null,r.a.createElement("button",{onClick:function(){return j(!O)}},"Display ",O?"Important":"All")," Currently displaying ",O?"all":"important"),r.a.createElement("ul",null,I.map((function(t){return r.a.createElement(l,{key:t.id,note:t,toggleImportance:(e=t.id,function(){var t=o.find((function(t){return t.id===e})),n=Object(u.a)({},t,{important:!t.important});b(e,n).then((function(t){c(o.map((function(n){return n.id===e?t:n})))})).catch((function(t){N("an error has occured with note id: ".concat(e)),setTimeout((function(){N(null)}),5e3),c(o.filter((function(t){return t.id!==e})))}))})});var e}))),r.a.createElement("form",{className:"NoteForm",onSubmit:function(t){t.preventDefault();var e={content:f,date:(new Date).toISOString(),important:Math.random()>.5};h(e).then((function(t){c(o.concat(t)),v("")})),document.querySelector(".NoteForm").reset()}},r.a.createElement("input",{placeholder:"type a note here",onChange:function(t){v(t.target.value)}}),r.a.createElement("button",{type:"submit"},"Save")))};n(37);p.a.get("https://dry-cove-65105.herokuapp.com/notes").then((function(t){}));c.a.render(r.a.createElement(v,null),document.getElementById("root"))}},[[15,1,2]]]);
//# sourceMappingURL=main.7f50f3d6.chunk.js.map