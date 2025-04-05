const input=document.getElementById("input");
const output=document.getElementById("output1");
const button=document.getElementById("check");
button.addEventListener("click",function(){
    const inputValue=input.value;
    console.log(inputValue);
    output.style,display="block"
    setTimeout(function(){
        output.innerHTML="Malware Detected";
    },5000);
});