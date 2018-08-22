var lolwa;
var nxt_pg_link=[];
var curr_page=1;
var link_pgn=2;
var aa;
var img_array=[];
var title_array=[];
var country=0;
var international=1;
function setDOMInfo(info){
	if(info){
		var c=info.links;
		setTable(c);
		nxt_pg_link.push(info.variable[0]);
		curr_page=info.variable[2];
		link_pgn=info.variable[1];
		country=info.variable[3];
		//console.log(country);
		//if(country=="in") console.log("OK");
		// console.log(international);
	}
}
function diff_months(dt2,dt1){
	var diff=(dt2.getTime()-dt1.getTime())/1000;
	diff/=(60*60*24*7*4);
	return Math.abs(Math.round(diff))
}
function percentage(num,per){
	return(num/100)*per
}
function calculate_est_sales(num_mnths,reviews){
	if(num_mnths==0){
		num_mnths=1
	}
	if(reviews==0)
		return 1;
	if(reviews.length>=4){
		reviews=((parseInt(reviews)+percentage(reviews,75))/num_mnths)*14;
		return reviews.toFixed(2)
	}
	else if(reviews.length===3){
		reviews=((parseInt(reviews)+percentage(reviews,75))/num_mnths)*25;
		return reviews.toFixed(2)
	}
	else if(reviews.length<=2){
		reviews=((parseInt(reviews)+percentage(reviews,75))/num_mnths)*44;
		return reviews.toFixed(2)
	}
}


function setTable(c){
	var table=document.getElementById("rwd-table");
	var ind=table.rows.length;
	var c_length=c.length;
	for(i=0;i<c.length;i++){
		c[i]=c[i].substring(0,c[i].indexOf("ref="));
		$.get(c[i]+"&psc=1&th=1",null,function(text){
			lolwa=text;
			var el=document.createElement('div');
			el.innerHTML=lolwa;
			el.id="dynamic_object";
			//console.log(el);	
			var ttl_sellers=0;
			var used=($(".olp-used.olp-link",el).children('.a-size-mini.a-link-normal').text());
			var new_book=($(".olp-new.olp-link",el).children('.a-size-mini.a-link-normal').text());
			var mn_price;
			if(used){
				mn_price=(used.substring(used.indexOf("from")+4)).trim();
				used=used.substring(0,used.indexOf("Used"));
				ttl_sellers+=parseInt(used.replace(/,/g,'').trim())
			}
			if(new_book){
				new_book=new_book.substring(0,new_book.indexOf("New"));
				ttl_sellers+=parseInt(new_book.replace(/,/g,'').trim())
			}
			if(ttl_sellers==0)
				ttl_sellers=1;
			var title=$('#productTitle',el).html();
			if(!title)
				title=$("#ebooksProductTitle",el).html();
			if(!title) title=$("#aiv-content-title", el).html();
			if(!title){
				console.log("hey");
				title=$('.a2s-title-content',el)[0];
				if(title) title=title.innerText;
				// console.log($('.a2s-title-content',el)[0].innerText);
			}
			if(!title){
				title=$("#mas-title",el)[0]
				if(title) title=title.innerText;
			}
			if(!title){
				title=$("#btAsinTitle",el).text();
			}
			if(!title){
				title=$('#title_feature_div',el).text();
			}
			if(!title){
				title=$('#product-title',el).children().eq(0).text();
			}
			if(title)
			title=title.replace(/\s+/g," ").trim();
			else title="N/A";
			var brand;
			if($(".author.notFaded",el)){
				if($(".author.notFaded",el).children(".a-link-normal").text())
					brand=$(".author.notFaded",el).children(".a-link-normal").text().trim();
				else 
					brand=$(".a-link-normal.contributorNameID",el).text()
			}
			else 
				brand=$(".a-link-normal.contributorNameID",el).text();
			if(!brand)
				brand=$('#bylineInfo',el).text();
			var price=$("#priceblock_ourprice",el).text();
			if(!price){
				price=$('#priceblock_saleprice',el).text();
				if(country=="in")
				price=price.slice(0,price.length-3)
			}
			if(!price){
				price=$('#priceblock_dealprice',el).text();
				if(country=="in")
				price=price.slice(0,price.length-3)
			}
			if(!price){
				var sellers=($("#unqualified", el).children().eq(0).children().eq(0).text().trim());
				sellers=parseInt(sellers);
				sellers=sellers.toString();
				var price=($("#unqualified", el).children().eq(0).children().eq(1).text().trim());
			}
			if(!price&&country=="in"){
				//console.log("Noo");
				price=$(".a-size-base.a-color-price.a-color-price",el).text()
				if(country=="in")
				price=(price.slice(0,price.indexOf(".")).trim())
			}
			if(!price){
				if($("#tmmSwatches",el).find('.selected')[0]){
				//	$('.a-unordered-list.a-nostyle.a-button-list.a-horizontal').find('.selected').children().eq(0).find('.a-color-base')[0].innerText
					price=$('#tmmSwatches',el).find('.selected').children().eq(0).find('.a-color-base')[0];
					if(price){
						price=price.innerText;
					}
					else{
						console.log(this.url);
					}
				}
				else if($("#tmmSwatches",el).find('.unselected')[0]){
					price=$('#tmmSwatches',el).find('.unselected').children().eq(0).find('.a-size-base.a-color-secondary')[0];
					if(price){
						price=price.innerText;
					}
				}
			}
			var toys;
			if(!price){
				price=$('#actualPriceValue',el).children()[0];
				if(price){
					price=price.innerText;
				if(price.indexOf("Free")>=0) price="Free";
				toys="Amazon Digital Services,Inc.";
				}
			}
			if(!price){
				price=$('.guild_priceblock_value.a-hidden',el).text();
			}
			if(!price)
				price=0;
			var weight1;
			var min_price=$('.a-color-price',el);
			var customer_reviews=$('#acrCustomerReviewText',el).html();
			var rating=$('.a-icon-alt',el);
			var category=$('.nav-search-label',el).html();
			var offers1=$('.olp-padding-right',el).text();
			var weight=$('.size-weight .value',el);
			var seller_info=$('#merchant-info',el);
			var amazon=0;
			if(seller_info.text().toLowerCase().indexOf("sold by amazon")>=0) amazon=1;
			// if(amazon)
			//  seller_info=0;
			// else
			seller_info=seller_info.find('a:first').attr('href');
			var sellername;var isAmazonFulfilled=0;
			var Data_First_Available=$('.date-first-available .value',el).text();
			var num_bullets=$('#feature-bullets',el).children("ul.a-unordered-list.a-vertical.a-spacing-none").children().length;
			var num_images=$(".a-unordered-list.a-nostyle.a-button-list.a-vertical.a-spacing-top-micro",el).children('li.a-spacing-small.item').length;
			var desc_length=($('#productDescription > p:eq(0)',el).text()).trim().length;
			var offers=offers1.substr(0,offers1.indexOf('offer'));
			var min_price=offers1.indexOf('from');
			var min_price2=offers1.indexOf('.');
			var min_price=offers1.slice(min_price+4,min_price2);
			var image_link=$(".a-button.a-button-thumbnail.a-button-toggle.a-button-selected",el).children('.a-button-inner').children('.a-button-text').eq(0).children().attr('src');
			//console.log(image_link," <--> ",this.url," <--> ",$(".a-button.a-button-thumbnail.a-button-toggle.a-button-selected",el).children('.a-button-inner').children('.a-button-text').eq(0).children().eq(0).currentSrc);
			if(!image_link){
				image_link=$(".a-column.a-span3.a-spacing-micro.imageThumb.thumb",el).children().eq(0).attr('src');
			}
			if(!image_link){
				image_link=$(".a2s-skill-icon.a2s-image-block-container",el).eq(0).children().attr('src');
			}
			
			var img_src;
			if(image_link){
			var image_parts=image_link.split("_");
			image_parts[1]="UX342";
			img_src=image_parts.join();
			var image=new Image();
			image.src=img_src;}
			if(!img_src){
				img_src=$("#ebooks-img-canvas",el).children().attr('src');
			}
			if(!img_src){
				img_src=$(".image-wrapper",el).children().eq(0).children().attr('src');
			}
			if(!img_src){
				img_src=$("#issuance-product-image",el).eq(0).children().attr('src');
				// console.log(image_link);
			}
			if(!img_src){
				img_src=$('#coverArt_feature_div',el).eq(0).children()[0];
				if(img_src) img_src=img_src.src;
			}
			if(!img_src){
				img_src=$('#imgTagWrapperId',el).children()[0];
				if(img_src) img_src=img_src.src;
			}
			//console.log(img_src);
			if(!img_src) img_src=null;
			img_array.push(img_src);
			//console.log(img_src);
			title_array.push(title);
			if(seller_info)
			if(seller_info.indexOf('isAmazonFulfilled=1')>=0){
				isAmazonFulfilled=1
			}
			if(!Data_First_Available){
				var myStr=$("#SalesRank",el).text();
				myStr=myStr.replace(/[\r\n]+/g,' ');
				var subStr=myStr.match("Amazon Bestsellers Rank: (.*) in ");
				if(subStr){
					var rank=(subStr[1].substring(subStr[1].indexOf("#")+1,subStr[1].indexOf(" in")));
					rank=rank.replace(/,/g,'')
				}
				else{
					rank="N/A"
				}
			}
			else{
				var rank=$('.value',el);
				for(k=0;k<rank.length;k++){
					var rank1=rank.eq(k).text();
					if(rank1.indexOf('#')>=0){
						rank=rank1.substring(2,rank1.indexOf('i')-1).replace(/\s+/g," ").trim();
						rank=rank.substring(1).replace(/,/g,'');
						break
					}
				}
			}
			var indx=1;
			for(j=1;j<rating.length;j++){
				var checking=rating.eq(j).html();
				if(checking==="Previous page"||checking==="Back"){
					indx=j-1;
					break
				}
			}
			if(customer_reviews){
				customer_reviews=customer_reviews.substring(0,customer_reviews.indexOf(' '));
				customer_reviews=customer_reviews.trim().replace(/,/g,'')
			}
			else{
				customer_reviews=0;
			}
			var row=table.insertRow(ind);
			if(ind%2==0){
				row.className="even"
			}
			else{
				row.className="odd"
			}
			ind+=1;
			var cell0=row.insertCell(0);
			var cell1=row.insertCell(1);
			cell1.className="dispimage";
			cell1.id=ind;
			var link=document.createElement("a");
			link.setAttribute("target","_blank");
			link.setAttribute("href",this.url);
			cell1.appendChild(link);
			var cell3=row.insertCell(2);
			var cell5=row.insertCell(3);
			var cell6=row.insertCell(4);
			var cell9=row.insertCell(5);
			var cell11=row.insertCell(6);
			var cell12=row.insertCell(7);
			var cururl=this.url;
			var asin;
			
			if((cururl.indexOf("dp/")>=0))
				asin=cururl.substring(cururl.indexOf("dp/")+3).split("/")[0];
			else if(cururl.indexOf("product")>=0){
				asin=cururl.substring(cururl.indexOf("product")+8).split('/')[0];
			}
			cell12.innerHTML=asin;
				cell11.innerHTML="N/A";
			if(price=="")
			price=min_price;cell0.innerHTML=ind-1;
			link.innerHTML=title;
			cell3.innerHTML=price.trim().replace(/,/g,'');
			if(isAmazonFulfilled)
			cell5.innerHTML="FBA";
			else
			cell5.innerHTML="MCH";
			if(offers.trim())
			cell9.innerHTML=offers.trim();
			if(cell9.innerHTML==""){
				var sellers_count=$('#mbc.a-box-group',el).children().eq(7).text();
				if(sellers_count){
					sellers_count=sellers_count.trim();
					if(sellers_count){
						//console.log(sellers_count);
						var sellers_count_tmp=sellers_count;
						sellers_count=sellers_count.split(" ");
						sellers_count=sellers_count[0].split("offers");
						if(parseInt(sellers_count[0]))
						cell9.innerHTML=sellers_count[0];
						else cell9.innerHTML=sellers_count_tmp.match(/\d+/)[0];
					}
				}
			}
			if(cell9.innerHTML==""){
				if(ttl_sellers)
				cell9.innerHTML=ttl_sellers;
				else{
					cell9.innerHTML="1";
				}
			}
			if((parseInt(sellers))&&ttl_sellers==1){
				cell9.innerHTML=sellers;
			}
			if(cell9.innerHTML=="") cell9.innerHTML="1";
			if(seller_info){
				$.get("https://www.amazon."+country+seller_info,null,function(text2){
					var el2=document.createElement('div');
					el2.innerHTML=text2;
					var name=$('#sellerName', el2).html();
					if(name){
						cell6.innerHTML=($('#sellerName',el2).html());
						var rate=parseFloat($("#seller-feedback-summary",el2).children().eq(0).children().eq(0).text().split(" ")[0])
						if(rate)
						cell11.innerHTML=rate;
					}
				});
			}
			else if(amazon){
				cell6.innerHTML="Amazon."+country;
			}
			else{
				cell6.innerHTML="N/A";
			}
			if(cell11.innerHTML==""&&country=="in"){
				var x1=($("#merchant-info",el).text());
				x1=x1.substring(x1.indexOf("(")+1).split(" ");
				if(x1)
				cell11.innerHTML=parseFloat(x1);
			}
			if(cell11.innerHTMl=="NaN") cell11.innerHTML="N/A";
			
			if(cell6.innerHTML==""&&country!="in"){
				cell6.innerHTML="Amazon."+country;
			}
			if(toys){
				cell6.innerHTML=toys;
			}
			if(cell6.innerHTML==""){
				cell6.innerHTML="N/A";
			}
			var x=cell3.innerHTML;
			if(x!="N/A"&&(country=="in")){
				cell3.innerHTML=parseInt(x)
			}
			if(cell3.innerHTML=="NaN"){
				cell3.innerHTML="N/A"
			}
			if(cell3.innerHTML!="N/A"&&(cell3.innerHTML.indexOf("$"))>=0) cell3.innerHTML=cell3.innerHTML.split(" ")[0];
			if(cell3.innerHTML=="") cell3.innerHTML="N/A";
			if($('#sold-by-merchant',el).text()){
				console.log($('#sold-by-merchant',el).text().split(':')[1].trim());
				cell6.innerHTML=$('#sold-by-merchant',el).text().split(':')[1].trim();
			}
			var seller_name=cell6.innerHTML;
			seller_name=seller_name.toLowerCase();
			//console.log(seller_name);
			if(seller_name.indexOf("amazon")>=0) cell5.innerHTML="FBA";
			stopthecall(c_length,ind)
		})
	}
	// $('#loading').hide();
}
$(window).scroll(function(){
	var height=$(window).scrollTop();
	if(height>100){
		$('#back2Top').fadeIn();
	}
	else{
		$('#back2Top').fadeOut()
	}
});
$(document).ready(function(){
	var btn=document.getElementById("btn");
	btn.onclick=function(){
		curr_page++;
		var regex_=new RegExp('page='+link_pgn,'g');
	var ln=nxt_pg_link[0].replace(regex_,'page='+curr_page);
	var z=new Array();
	$.get(ln,null,function(text3){
		var el3=document.createElement('div');
		el3.innerHTML=text3;
		var c=$(".a-link-normal.s-access-detail-page.s-color-twister-title-link.a-text-normal",el3);
		for(i=0;i<c.length;i++){
			var element1=c[i].innerHTML;
			var check="[Sponsored]";
			if(element1.indexOf(check)<0)
			z.push(c[i].href)
		}
		setTable(z)
	})
}
$("#myInput").keyup(function myFunction(){
	var input,filter,found,table,tr,td,i,j;
	input=document.getElementById("myInput");
	filter=input.value.toUpperCase();
	table=document.getElementById("rwd-table");
	tr=table.getElementsByTagName("tr");
	for(i=1;i<tr.length;i++){
		td=tr[i].getElementsByTagName("td");
		for(j=0;j<td.length;j++){
			if(td[j].innerHTML.toUpperCase().indexOf(filter)>-1){
				found=!0
			}
		}
		if(found){
			tr[i].style.display="";
			found=!1
		}
		else{
			tr[i].style.display="none"
		}
	}
});
const getCellValue=(tr,idx)=>tr.children[idx].innerText||tr.children[idx].textContent;
const comparer=(idx,asc)=>(a,b)=>((v1,v2)=>v1!==''&&v2!==''&&!isNaN(v1)&&!isNaN(v2)?v1-v2:v1.toString().localeCompare(v2))(getCellValue(asc?a:b,idx),getCellValue(asc?b:a,idx));document.querySelectorAll('th').forEach(th=>th.addEventListener('click',(()=>{const table=th.closest('table');Array.from(table.querySelectorAll('tr:nth-child(n+2)')).sort(comparer(Array.from(th.parentNode.children).indexOf(th),this.asc=!this.asc)).forEach(tr=>table.appendChild(tr))})));
function exportTableToCSV($table,filename){
	var $rows=$table.find('tr:has(td)'),tmpColDelim=String.fromCharCode(11),tmpRowDelim=String.fromCharCode(0),colDelim='","',rowDelim='"\r\n"',csv='"'+$rows.map(function(i,row){var $row=$(row),$cols=$row.find('td');return $cols.map(function(j,col){var $col=$(col),text=$col.text();return text.replace(/"/g,'""')}).get().join(tmpColDelim)}).get().join(tmpRowDelim).split(tmpRowDelim).join(rowDelim).split(tmpColDelim).join(colDelim)+'"';if(!1&&window.navigator.msSaveBlob){var blob=new Blob([decodeURIComponent(csv)],{type:'text/csv;charset=utf8'});window.navigator.msSaveBlob(blob,filename)}else if(window.Blob&&window.URL){var blob=new Blob([csv],{type:'text/csv;charset=utf8'});var csvUrl=URL.createObjectURL(blob);$(this).attr({'download':filename,'href':csvUrl})}else{var csvData='data:application/csv;charset=utf-8,'+encodeURIComponent(csv);$(this).attr({'download':filename,'href':csvData,'target':'_blank'})}}
$(".export").on('click',function(event){
	var args=[$('#rwd-table'),'export.csv'];
	exportTableToCSV.apply(this,args)
})});
function hov(){
	aa=document.getElementsByClassName("dispimage");
	$(".dispimage").hover(function(){
		$("#image_block").css("display","block");
		var cntnt=this.id-2;
		$(this)[0].title=title_array[cntnt];
		$("#image").attr('src',img_array[cntnt])
		//console.log(img_array[cntnt]);
		},function(){
		$("#image_block").css("display","none")
		}
	)}
function stopthecall(c,ind){
	//console.log(ind, c);
	if((c.length!=0)&&(ind>(((80/100)*c)))){
		hov();
		$('#loading').hide()
	}
}
function addDays(theDate,days){
	return new Date(theDate.getTime()+days*24*60*60*1000);
}
function valDate(){
	var newDate=addDays(new Date(subscriptionDate),30);
	if(newDate>new Date()){
		return!0
	}
	return!1;
}
window.addEventListener('DOMContentLoaded',function(){
	chrome.tabs.query({
		active:!0,currentWindow:!0
		},function(tabs){
			chrome.tabs.sendMessage(tabs[0].id,{
			from:'popup',subject:'DOMInfo'
			},setDOMInfo)
		}
	)}
)