console.log("KLT MONITOR START");



const URL =

"https://docs.google.com/spreadsheets/d/1UWgARG6-VexkyLBurzucHsQ_t7cILSieU6d3i-ia2EM/export?format=csv&gid=0";





function parseCSV(text){


let rows=[];

let row=[];

let cell="";

let quote=false;



for(let i=0;i<text.length;i++){


let char=text[i];


if(char === '"'){


quote=!quote;


}

else if(char === "," && !quote){


row.push(cell);

cell="";


}

else if(char === "\n" && !quote){


row.push(cell);

rows.push(row);


row=[];

cell="";


}

else{


cell+=char;


}


}



if(cell){

row.push(cell);

rows.push(row);


}


return rows;


}






function loadSheet(){



fetch(URL)


.then(res=>res.text())


.then(csv=>{



let rows=parseCSV(csv);



let html="";



for(let i=2;i<rows.length;i++){



let r=rows[i];



if(!r[0]) continue;



let durasi = r[6] || "";

let jamMasuk = r[5] || "";



let rowClass="row-normal";


let durasiClass="durasi-normal";





if(durasi.includes("Overtime")){


rowClass="row-overtime";


durasiClass="";


}



else if(!jamMasuk){


rowClass="row-pending";


durasi="BELUM CHECK IN";


durasiClass="";


}





html += `


<tr class="${rowClass}">


<td>${r[0]}</td>


<td>${r[1]}</td>


<td>${r[2]}</td>


<td>${r[3]}</td>


<td>${r[4]}</td>


<td>${r[5] || "-"}</td>


<td class="${durasiClass}">

${durasi.replace(/\n/g,"<br>")}

</td>


</tr>



`;



}



document.getElementById("data").innerHTML=html;



})


.catch(err=>{


console.log(
"ERROR",
err
);


});



}



loadSheet();



setInterval(()=>{


loadSheet();


},5000);