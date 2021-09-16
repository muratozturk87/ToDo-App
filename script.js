// Kullanacağımız Değişkenlerimizi Hazırlıyoruz

const form = document.querySelector("form"); // form etiketini aldık
const input = document.querySelector("#txtTaskName"); // görevlerin girileceği input u aldık
const btnDeleteAll = document.querySelector("#btnDeleteAll")// bütün görevleri silen delete butonunu aldık
const taskList = document.querySelector("#task-list");// eklenen görevlerin listeleneceği ul etiketini aldık
let items; // local storage dan aldığımız bilgiler için kullanacağımız değişken

/* **************************************************************************************** */

// eventleri tekbir yerden kontrol etmek için fonksiyon oluşturuyoruz

eventListener();// fonksiyonu çalıştırıyoruz eventler çalışsın diye

loadItems();// gelen veriyi yüklüyoruz


//eventleri çalıştırdığımız fonksiyon
function eventListener() {
    //submit eventi
    form.addEventListener("submit",addNewItem);// form da submit işlemi olduğunda çalışacak fonksiyonu tanımladık

    // click eventi
    taskList.addEventListener("click",deleteItem);// ul üzerinde click işlemi olduğunda çalışacak fonksiyonu tanımladık
    btnDeleteAll.addEventListener("click",deleteAllItems);// delete all butonuna basılınca çalışacak olan fonksiyonu tanımladık
}

// kayıtlı olan verileri yüklüyoruz 
function loadItems() {

    // local storage dan aldığımız bilgileri items değişkeni içine atıyoruz
    items = getItemsFromLS();// local storage da kayıtlı olan veriyi çekeceğimiz fonksiyonu çalıştırıyoruz

    // local storage dan gelen veriyi listeliyoruz
    items.forEach(function(item) {
        createItem(item);
    });
}


//local storage da kayıtlı olan veriyi alan fonksiyon
function getItemsFromLS(items) {
    if (localStorage.getItem("items") === null) {
        items=[]; //local storage da items adında veri yoksa  items değişkenini boş dizi haline getiriyoruz
    }else{
        items= JSON.parse(localStorage.getItem("items"));// items adında veri var ise onu  item değişkeni içine atıyoruz
    }

    return items;// aldığımız veriyi döndürüyoruz
}


// veriyi local storage a dışarıdan gelen veriyi kayıt yapan method
function setItemToLS(text) {
    items= getItemsFromLS();// local storage da kayıtı olan veriyi aldık
    items.push(text);// aldığımız verilere dışardan gelen veriyi ekledik
    localStorage.setItem("items",JSON.stringify(items));// verinin son halini local storage a ekledik
}



function deleteItemFromLS(text) {
    items = getItemsFromLS();//local storagedaki tüm veriyi çektik
    items.forEach(function(item,index) {
        //döngüdeki değer ile dışarıdan gelen değer aynı ise silme işlemini yaptırıyoruz
        if (item === text) {
            items.splice(index,1);//1.parametre silinecek index numarası 2.parametre ise silinecek eleman sayısı
        }
    });

    localStorage.setItem("items",JSON.stringify(items));// silme işlemi tamamlandıktan sonra veriyi tekrar local storage a kayıt ediyoruz
}



// dışarıdan gelen veri ile li elemanlarını oluşturuyoruz
function createItem(text) {
    
 // inputdan bir veri geldiğinde bunu göstermek için li ve içindeki elemanları  oluşturalım
 // li oluşturuldu
 const li = document.createElement("li");// li elemanını oluşturduk
 li.className="list-group-item list-group-item-secondary"; // li ye class atadık
 li.appendChild(document.createTextNode(text));// fonksiyona dışardan gelen text'i li elemanının içerisine koyduk


 // a  oluşturuldu
 const a = document.createElement("a");// a elemanını oluşturduk
 a.className="delete-item float-right"; // a ya class atadık
 a.setAttribute("href","#");// a ya href özelliği atadık 1. parametre özelliğin adı 2. parametre değeri
 a.innerHTML="<i class='fas fa-times'></i>";
 
 li.appendChild(a);// li ile a etiketleri ilişkilendirildi li nin içine a etiketi koyuldu (a etiketi  li nin child'ı oldu)
 taskList.appendChild(li);// hazırlamış olduğu li elemanını ul elemanı içine koyduk
}


// submit eventi tetiklendiğinde task eklemek için çalışacak method
function addNewItem(e) {

    e.preventDefault();// submit butonuna basıldığında sayfanın yenilenmesini engelledik
    
    //inputdan gelen yeni veriyi ekliyoruz
    createItem(input.value);

    // inputdan gelen veriyi local storage a ekliyoruz
    setItemToLS(input.value);

    // input da  veri girişi olmadan submit butonuna basılırsa uyarı veriyoruz
    if (input.value === "") {
        alert("Bir Görev Giriniz");
    }
   
    //input temizleme
    input.value="";// veri eklendikten sonra inputun içini temizliyoruz

    
    
}



// ul üzerinde click eventi tetiklendiğinde delete işlemi yapacak olan method
function deleteItem(e) {

    e.preventDefault();// sayfanın yenilenmesini iptal ediyoruz

    // tıklanılan elemanın icon olup olmadığını kontrol ediyoruz
    if (e.target.className === "fas fa-times") {
        //parent üst eleman anlamına gelir
        //parentElement ile seçili olan elemanın bir üstündeki elemanı seçebilir.
        //iki kere parentElement kullandığımızda 2 üst elemana çıkmış oluruz 
        // ilk parentElement ile i elemanının üzerindeki  a elemanına 2. parentElement ile de a elemanının üzerindeki li elemanına ulaşmış oluyoruz
        // remove ile de ulaştığımız li elemanını siliyoruz
        e.target.parentElement.parentElement.remove();


        // Local Storage da silme işlemi için fonksiyona bilgiyi gönderdik
        deleteItemFromLS(e.target.parentElement.parentElement.textContent);

    }


    
}


// delete All butonunua basılınca bütün veriyi silecek olan method
function deleteAllItems(e) {

    if (confirm("Emin misin ?")) {

        // task list'in (ul'nin) içinde bir eleman olduğu sürece döngü çalışcak
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);// her döngüde denk gelen ilk elemanı silecek
        }

        //local storage daki tüm veriyi siliyoruz
        localStorage.clear();
    

    }
    e.preventDefault();

}