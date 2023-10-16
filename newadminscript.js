
const toggler = document.getElementById('toggle');
const toggler_1 = document.getElementById('toggle');
const dSideBar = document.getElementById('d-sidebar');
const dContentContainer = document.getElementById('d-content-container');
const dNavbar = document.getElementById('d-navbar');
const dFooter = document.getElementById('d-footer');
const userInfoDetail=document.getElementById('d-user-info-detail');
const userInfo=document.getElementById('d-user-info');
const userInfoName=document.getElementById('d-user-info-name');
const tooltips=document.querySelectorAll('#tooltips');

const btnTambah=document.querySelector('.tambah');
const btnProfile=document.querySelector('.profile');

var modal = document.getElementById("myModal");
var modalProfile = document.getElementById("myModalProfile");
var span = document.getElementsByClassName("close")[0];
var spanClose = document.getElementsByClassName("close")[2];

if(btnProfile){
  btnProfile.onclick = function() {
    modalProfile.style.display = "block";
  }

  spanClose.onclick = function() {
    modalProfile.style.display = "none";
  }
}

if(btnTambah){
  btnTambah.onclick = function() {
    modal.style.display = "block";
  }

  span.onclick = function() {
    modal.style.display = "none";
  }
}


if(toggler.checked){
    toggler.checked=false;
}


toggler.addEventListener('click', () => {
    dSideBar.classList.toggle('active-toggle');
    dSideBar.classList.toggle('show-sidebar');
    dContentContainer.classList.toggle('active-toggle');
    dNavbar.classList.toggle('active-toggle');
    dFooter.classList.toggle('active-toggle');
    userInfoDetail.classList.toggle('active-toggle');
    userInfo.classList.toggle('active-toggle');
});

toggler_1.addEventListener('click', () => {
    let jmlToolTips=document.querySelectorAll('#tooltips');
    for(let i = 0; i < jmlToolTips.length; i++){
        console.log(i);
        tooltips[i].classList.toggle('tooltips');
    }
});


