function insert_div(){
    var iDiv = document.createElement('div');
    iDiv.id = 'mydiv';
    document.getElementsByTagName('body')[0].appendChild(iDiv);
    var innerDiv = document.createElement('div');
    innerDiv.id="mydivheader";
    innerDiv.innerHTML="Click here to move<br>Click here to moveClick here to moveClick here to move";
    iDiv.appendChild(innerDiv);
    var height=$(window).height();
    var width=$(window).width();
    $("#mydiv").css({"position":"fixed",
      "top": "50%",
      "left": "50%",
      "cursor": "all-scroll",
      "transform": "translate(-50%, -50%)",
      "background-color": "#f1f1f1",
      "text-align": "center",
      "border": "1px solid #d3d3d3",
      "resize":"both",
      "overflow": "auto",
      "min-height": "100px",
      "min-width": "100px",
      "max-height": height,
      "max-width": width
      });
      dragElement(document.getElementById("mydiv"));
  
  function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    /* if present, the header is where you move the DIV from:*/
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
  }
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  
  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }
  
  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
  }
  }
  
  
  chrome.runtime.sendMessage({
    from:    'content',
    subject: 'showPageAction'
  });
  
  // Listen for messages from the popup
  chrome.runtime.onMessage.addListener(function (msg, sender, response) {
    // First, validate the message's structure
    if ((msg.from === 'popup') && (msg.subject === 'DOMInfo')) {
      // Collect the necessary data 
      load_doc();
       
       function load_doc(){
       var curr_url=window.location.toString();
       var country="in";
       country=curr_url.substring((curr_url.indexOf("amazon.")+7)).split("/");
       country=country[0];
       console.log(country);
       var international=1;
       //  if(x1.indexOf(".com")>=0) international=1;
      //  console.log(international);
       var c = document.getElementsByClassName("a-link-normal s-access-detail-page  s-color-twister-title-link a-text-normal");
       if(c.length==0){
         c=$(".a-color-base.s-line-clamp-3").children(".a-link-normal");
         console.log(c);
        }
       if(c.length==0){
         c=$(".a-box-group.a-spacing-top-micro.acs_product-title").children('.a-link-normal');
       }
      //  console.log(c.length);
       var nxt_link = $('#pagn').children('.pagnLink').eq(1).children().attr('href');
       var link_pg = $('#pagn').children('.pagnLink').eq(1).children().html();
       var curr_page = $('#pagn').children('.pagnCur').html();
       //if(international)
       nxt_link = "https://www.amazon."+country+nxt_link;
       //else
       //nxt_link = "https://www.amazon.in"+nxt_link;
       //  replace(/page=2/g,'page=3').replace(/sr_pg_2/g,'sr_pg_3')
       // nxt_link="https://www.amazon.in"+nxt_link;
       var z = new Array();
       z.push(nxt_link);
       z.push(link_pg);
       z.push(curr_page);     
       z.push(country);
       var z5 = new Array();
        for(i=0;i<c.length;i++){
          var element1 = c[i].innerHTML; 
          var check = "[Sponsored]";
          if(element1.indexOf(check)<0){
             z5.push(c[i].href);
            console.log(c[i].href);
            }
        }
        
  
      var domInfo = {
        variable:z,
        links: z5
      };
  
    
  
  
      response(domInfo);
    }
    }
  });