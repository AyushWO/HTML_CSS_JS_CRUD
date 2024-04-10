let a = {};
console.log(a);
a["key1"] = "value1";
a["key2"] = "value2";
a["key3"] = "value3";
a["key4"] = "value4";

//using forEach loop
for(let k in a){
    console.log(k+" -> "+a[k]);
}
// direct logginf
console.log(a);
//type of
console.log(typeof(a));