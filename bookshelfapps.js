const buku = [];
const RENDER_EVENT = 'render-buku';
const SAVED_EVENT = 'saved-buku';
const STORAGE_KEY = 'BOOKSHELF_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    const submitFormEdit = document.getElementById('form-edit');
    const inputSearchBook = document.getElementById("searchBook");
    const inputTahun=document.getElementById('tahun');
    const judul=document.getElementById('judul');
    

    inputTahun.addEventListener('keyup', function(event){
      event.preventDefault();
      hanyaAngkaSajaBoleh();
      
    });
   

    inputSearchBook.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });
    inputSearchBook.addEventListener("keyup", function (event) {
        event.preventDefault();
        searchBook();
    });

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
       
        let saveData=confirm("Simpan Data ke Local Storage?");
            if(saveData)
            {
                addBook();
                hapusDataForm();
                judul.focus();
            }
    });
    submitFormEdit.addEventListener('submit', function (event) {
        event.preventDefault();
        
        let saveData=confirm("Update Data ke Local Storage?");
            if(saveData)
            {
                EditBook();
                hapusDataForm();
                judul.focus();
                var modalEdit=document.getElementById('myModalEdit');
                modalEdit.style.display = "none";
            }
    });


    if (isStorageExist()) {
      loadDataFromStorage();
    }
});
function hapusDataForm() {
    let inputData=document.querySelectorAll('input');
    console.log(inputData);
    for(let data of inputData)
    {
        data.value="";
    }
} 

function addBook() {
    const judul = document.getElementById('judul').value;
    const penulis = document.getElementById('penulis').value;
    const tahun = parseInt(document.getElementById('tahun').value);
   
    const generatedID = generateId();
    const objectBuku = generateObjectBuku(generatedID, judul, penulis, tahun, false);
    buku.push(objectBuku);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function EditBook() {
  const bukuId = document.getElementById('bookid').value;
  removeBukuFromLocalStorage(bukuId);
  const judul = document.getElementById('judul-edit').value;
  const penulis = document.getElementById('penulis-edit').value;
  const tahun = parseInt(document.getElementById('tahun-edit').value);
  const isCompleted = document.getElementById('iscompleted').value;

  if(isCompleted.toLowerCase() === "true"){
    boolCompleted=true;
  }
  else{
    boolCompleted=false;
  }

  const objectBuku = generateObjectBuku(bukuId, judul, penulis, tahun, boolCompleted);
  buku.push(objectBuku);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function ShowToEditBook(bukuId) {
  const targetBuku = findIndexBuku(bukuId);
  if (targetBuku === -1) return;
  
  const bookid=document.getElementById('bookid');
  const judul=document.getElementById('judul-edit');
  const penulis=document.getElementById('penulis-edit');
  const tahun=document.getElementById('tahun-edit');
  const isCompleted=document.getElementById('iscompleted');
  bookid.value=buku[targetBuku].id;
  judul.value=buku[targetBuku].title;
  penulis.value=buku[targetBuku].author;
  tahun.value=buku[targetBuku].year;
  isCompleted.value=buku[targetBuku].isCompleted;
  judul.focus();
}

function generateId() {
    return +new Date();
}

function generateObjectBuku(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBookList = document.getElementById('new-buku');
    uncompletedBookList.innerHTML = '';
   
    const completedBookList = document.getElementById('completed-buku');
    completedBookList.innerHTML = '';

    for (const bukuItem of buku) {
        const bukuElement = makeBuku(bukuItem);
        if (!bukuItem.isCompleted)
            uncompletedBookList.append(bukuElement);
        else
            completedBookList.append(bukuElement);
    }
});


function makeBuku(objectBuku) {
    const imageItem = document.createElement('img');
    imageItem.classList.add('image');
    imageItem.setAttribute('alt','Image');
    imageItem.setAttribute('src','booksreads.png');
    imageItem.setAttribute('loading','lazy');
    const imageContainer=document.createElement('div');
    imageContainer.classList.add('image-container');
    imageContainer.append(imageItem);
    

    const textTitle = document.createElement('h2');
    textTitle.innerText = objectBuku.title;
    const textKeterangan = document.createElement('p');
    textKeterangan.innerText = "Penulis - "+ objectBuku.author + ", Terbit Tahun - "+objectBuku.year;
   

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textKeterangan);

    
    const container = document.createElement('div');
    container.classList.add('item');
    container.append(imageContainer, textContainer);
    container.setAttribute('id', `buku-${objectBuku.id}`);
    
    

    if (objectBuku.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.innerHTML='<i class="fa-solid fa-rotate-left"></i>';
        undoButton.setAttribute('title','Cancel');
        undoButton.classList.add('undo-button');
     
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(objectBuku.id);
        });
     
        const trashButton = document.createElement('button');
        trashButton.innerHTML='<i class="fa-regular fa-trash-can"></i>';
        trashButton.setAttribute('title','Hapus');
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
          var modal = document.getElementById("myModalDelete");
          var span = document.getElementsByClassName("close")[1];
          modal.style.display = "block";
          
          span.onclick = function() {
            modal.style.display = "none";
          }
          
          const hapusData=document.getElementById('hapus');
          if(hapusData)
          {
            removeBukuFromLocalStorage(objectBuku.id);
          }
          hapusData.addEventListener('click',()=>{
            document.dispatchEvent(new Event(RENDER_EVENT));
            saveData();
          })
        });
     
        const editButton=document.createElement('button');
        editButton.innerHTML='<i class="fa-regular fa-edit"></i>';
        editButton.setAttribute('title','Edit');
        editButton.classList.add('btn-cek');

        editButton.addEventListener('click', function () {
          var modal = document.getElementById("myModalEdit");
          var span = document.getElementsByClassName("close")[3];
         
          modal.style.display = "block";
          ShowToEditBook(objectBuku.id);
          
          span.onclick = function() {
            modal.style.display = "none";
          }
        });
        
        textContainer.append(undoButton, editButton, trashButton);
      } else {
        const finishButton = document.createElement('button');
        finishButton.classList.add('btn-cek');
        finishButton.innerHTML='<i class="fa-solid fa-circle-check"></i>';
        finishButton.setAttribute('title','Selesai');
        finishButton.addEventListener('click', function () {
          addBukuToCompleted(objectBuku.id);
        });

        const trashButton = document.createElement('button');
        trashButton.innerHTML='<i class="fa-regular fa-trash-can"></i>';
        trashButton.setAttribute('title','Hapus');
        
        trashButton.classList.add('trash-button');
     
        trashButton.addEventListener('click', function () {
            var modal = document.getElementById("myModalDelete");
            var span = document.getElementsByClassName("close")[1];
            modal.style.display = "block";
            
            span.onclick = function() {
              modal.style.display = "none";
            }
            
            const hapusData=document.getElementById('hapus');
            if(hapusData)
            {
              removeBukuFromLocalStorage(objectBuku.id);
            }
            hapusData.addEventListener('click',()=>{
              document.dispatchEvent(new Event(RENDER_EVENT));
              saveData();
            })
           
        });

        const editButton=document.createElement('button');
        editButton.innerHTML='<i class="fa-regular fa-edit"></i>';
        editButton.setAttribute('title','Edit');
        editButton.classList.add('btn-cek');

        editButton.addEventListener('click', function () {
          var modal = document.getElementById("myModalEdit");
          var span = document.getElementsByClassName("close")[3];
         
          modal.style.display = "block";
          ShowToEditBook(objectBuku.id);
          
          span.onclick = function() {
            modal.style.display = "none";
          }
        });

        textContainer.append(finishButton, editButton, trashButton );
      }

    return container;
  }

  function addBukuToCompleted (bukuId) {
    const targetBuku = findBuku(bukuId);
   
    if (targetBuku == null) return;
    targetBuku.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function searchBook() {
        const searchBook = document.getElementById("carijudul");
        const filter = searchBook.value.toUpperCase();
        const bookItem = document.querySelectorAll(".item");
        for (let i = 0; i < bookItem.length; i++) {
            txtValue = bookItem[i].textContent || bookItem[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                bookItem[i].style.display = "";
            } else {
                bookItem[i].style.display = "none";
            }
        }
  }

  function findBuku(bukuId) {
    for (const bukuItem of buku) {
      if (bukuItem.id === bukuId) {
        return bukuItem;
      }
    }
    return null;
  }

  function removeBukuFromCompleted(bukuId) {
    const targetBuku = findIndexBuku(bukuId);
   
    if (targetBuku === -1) return;
   
    buku.splice(targetBuku, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function removeBukuFromLocalStorage(bukuId) {
    const targetBuku = findIndexBuku(bukuId);
   
    if (targetBuku === -1) return;
   
    buku.splice(targetBuku, 1);
  }

  function undoTaskFromCompleted(bukuId) {
    const targetBuku = findBuku(bukuId);
   
    if (targetBuku == null) return;
   
    targetBuku.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function findIndexBuku(bukuId) {
    for (const index in buku) {
      if (buku[index].id === bukuId) {
        return index;
      }
    }
   
    return -1;
  }


  function saveData() {
    if (isStorageExist()) {
      const parsed = JSON.stringify(buku);
      localStorage.setItem(STORAGE_KEY, parsed);

      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  function isStorageExist() {
    if (typeof (Storage) === undefined) {
      alert('Browser kamu tidak mendukung local storage');
      return false;
    }
    return true;
  }

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData) ;
  
    if (data !== null) {
      for (const databuku of data) {
        buku.push(databuku);
      }
    }
   
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function hanyaAngkaSajaBoleh(){
    var validasiAngka = /^[0-9]+$/;
    var tahunLahir = document.getElementById("tahun");
    if (tahunLahir.value.match(validasiAngka)) {
    } 
    else {
      tahunLahir.value="";
      tahunLahir.focus();
      return false;
    }
  }

  