//
//async function calllist(){
    //let respone = await fetch ("https://codecyprus.org/th.api.list")
  //  let text = respone.text();
  //  console.log(text);

//}
//calllist();
fetch("https://codecyprus.org/th/api/list")
.then(response => response.text())
.then(text =>myDivElement.innertext = text);
