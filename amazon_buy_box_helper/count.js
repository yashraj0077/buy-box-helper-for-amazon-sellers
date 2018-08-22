function randomString(length, chars) {
    var mask = '';
    if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
    if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (chars.indexOf('#') > -1) mask += '0123456789';
    if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';
    var result = '';
    for (var i = length; i > 0; --i) result += mask[Math.floor(Math.random() * mask.length)];
    return result;
}
$(document).ready(function(){
    $("#submit_btn").click(function(){
        $("#signupform").submit(function(e){
            e.preventDefault();
        });
        var email=document.getElementById("email").value;
        var merchant_id=document.getElementById("merchant_id").value;
        
        // alert(merchant_id);
        var referalkey=document.getElementById("referalkey").value;
        var result=validatekey(referalkey);
        //alert(validatekey(referalkey.toLowerCase().trim()));        
        if(merchant_id.trim()!=""&&validateEmail(email)&&result){
            var unique_key=randomString(32,'#Aa!');
            $.ajax({
                type: "GET",
                url: "https://www.sellergyan.com/lead.php?email="+email+"&type="+"buybox_tool"+referalkey+merchant_id+unique_key,
                data: null,
                cache: false,
                success: function() {
                    localStorage.setItem('email', email);
                    localStorage.setItem('count', 1);
                    localStorage.setItem('merchant_id', merchant_id);
                    localStorage.setItem('unique_key', unique_key);                    
                    window.location.href="popup.html";                    
                }
            });
        }
        else{
            if(merchant_id.trim()==""){
                alert("Please enter merchant id");
            }
            else if(!result)
                alert("Invalid referal key");
            else
                alert("Invalid mail id");
        }
    });

    if (localStorage) {
        // localStorage.removeItem("email");
        var email = localStorage.getItem('email'); 
        if (email != undefined && email != null) {
            var count =parseInt(localStorage.getItem('count'));
            var max_count = parseInt(localStorage.getItem('max_count'));
            if(count>=max_count){
                var dataString = 'merchantID=' + localStorage.getItem("merchant_id") + '&unique_key=' + localStorage.getItem("unique_key")+ '&product=buybox tool';                
                $.ajax({
                    type:"POST",
                    url:"https://prosellerai.com/payments/check.php",
                    data:dataString,
                    cache:false,
                    success:function(html){
                        var data=$.parseJSON(html);
                        if(data.status=="Success"){
                            var date=new Date();
                            if(new Date(data.expiry_date)>=date){
                               window.location.href="popup.html"; 
                            }
                            else{
                               window.location.href="purchase_account.html"; 
                            }
                        }
                        else{
                            window.location.href="purchase_account.html";
                        }
                    }
                });
            }
            else{
                count++;
                localStorage.setItem('count', count);
                document.getElementById("load").style.display="block";
                window.location.href="popup.html";
            }
        } 
        else{
            document.getElementById("email_form").style.display="block";
        }
    }
    else{
        alert("Please update your browser to continue our service");
    }  

});

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatekey(key) {
    var arr = ["sgwa", "sgfb", "sgfr", "sgma"];
    if(key=="") {
        localStorage.setItem("max_count", 20);        
        return 1;
    }
    for(i=0;i<arr.length;i++){
        if(key==arr[i]){
            localStorage.setItem("max_count", 40);
            return 1;
        }
    }
    localStorage.setItem("max_count", 20);
    return 0;
}