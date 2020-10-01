$(document).ready(function () {
  // Check for click events on the navbar burger icon
  $('.navbar-burger').click(function () {
    // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
    $('.navbar-burger').toggleClass('is-active');
    $('.navbar-menu').toggleClass('is-active');
  });
});
function displaySuccessToast(message) {
  iziToast.success({
    title: 'Success',
    message: message
  });
}

function displayErrorToast(message) {
  iziToast.error({
    title: 'Error',
    message: message
  });
}

function displayInfoToast(message) {
  iziToast.info({
    title: 'Info',
    message: message
  });
}

const API_BASE_URL = 'https://backend-vfl.herokuapp.com/';

function login() {
  // form validiation
  const username = document.getElementById('inputUsername').value;

  const password = document.getElementById('inputPassword').value;

  if (username.length > 0 && password.length > 0 && password.trim() !== '') {
    const dataForApiRequest = {
      username: username,
      password: password
    };
    document.getElementById('loginBtn').classList.remove('is-outlined');
    document.getElementById('loginBtn').classList.add('is-loading');
    $.ajax({
      url: API_BASE_URL + 'auth/login/',
      method: 'POST',
      data: dataForApiRequest,
      success: function (data, status, xhr) {
        localStorage.setItem('token', data.token);

        window.location.href = '/dashboard/index.html';
      },
      error: function (xhr, status, err) {
        displayErrorToast(
          'No Account Found. Click on register to create account'
        );
        document.getElementById('loginBtn').classList.add('is-outlined');
        document.getElementById('loginBtn').classList.remove('is-loading');
      }
    });
  } else {
    displayErrorToast('Please enter valid credentials!');
  }
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/';
}
function registerFieldsAreValid(
  firstName,
  lastName,
  email,
  username,
  password
) {
  if (
    firstName === '' ||
    lastName === '' ||
    email === '' ||
    username === '' ||
    password === ''
  ) {
    displayErrorToast('Please fill all the fields correctly.');
    return false;
  }
  if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    displayErrorToast('Please enter a valid email address.');
    return false;
  }
  if (username.trim().length < 8) {
    displayErrorToast('Username must be of 8 characters or more!');
    return false;
  }
  if (password.trim().length < 8) {
    displayErrorToast('Password must be of 8 characters or more!');
    return false;
  }
  return true;
}

function register() {
  const firstName = document.getElementById('inputFirstName').value.trim();
  const lastName = document.getElementById('inputLastName').value.trim();
  const email = document.getElementById('inputEmail').value.trim();
  const username = document.getElementById('inputUsername').value.trim();
  const password = document.getElementById('inputPassword').value;

  if (registerFieldsAreValid(firstName, lastName, email, username, password)) {
    displayInfoToast('Please wait...');

    const dataForApiRequest = {
      name: firstName + ' ' + lastName,
      email: email,
      username: username,
      password: password
    };

    document.getElementById('registerBtn').classList.remove('is-outlined');
    document.getElementById('registerBtn').classList.add('is-loading');

    $.ajax({
      url: API_BASE_URL + 'auth/register/',
      method: 'POST',
      data: dataForApiRequest,
      success: function (data, status, xhr) {
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard/index.html';
      },
      error: function (xhr, status, err) {
        displayErrorToast(
          'An account using same email or username is already created'
        );
        document.getElementById('registerBtn').classList.add('is-outlined');
        document.getElementById('registerBtn').classList.remove('is-loading');
      }
    });
  }
}

$(function () {
  $('#tags').autocomplete({
    source: availableTags
  });
});

function searchFieldsAreValid(city, products) {
  if (city === '') {
    displayErrorToast('Please do not leave city parameter empty!');
    return false;
  }
  return true;
}

function search() {
  const city = document.getElementById('tags').value;
  const products = document.getElementById('productsText').value;

  if (searchFieldsAreValid(city, products)) {
    document.getElementById('searchParent').innerHTML =
      '<div class="columns is-multiline" id="searchResult"></div>';
    // setTimeout(() => { console.log("delay!"); }, 200);

    $.ajax({
      url: API_BASE_URL + 'vendor/?city=' + city + '&products=' + products,
      method: 'GET',
      success: function (data, status, xhr) {
        document.getElementById('footerMain').classList.remove('main');
        document.getElementById('searchBtn').classList.add('is-outlined');
        document.getElementById('searchBtn').classList.remove('is-loading');

        for (var i = 0; i < data.length; i++) {
          var $newstr = $(
            '  <div class="column is-4"> <div class="card"> <div class="card-content"> <div class="media"> <div class="media-left"> <figure class="image is-48x48"> <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image"> </figure> </div> <div class="media-content"> <a id="1"> <p class="title is-4">' +
              data[i].name +
              '</p> </a> </div> </div> <div class="content contentCard">' +
              data[i].details +
              '<br> <hr> <p>' +
              data[i].city +
              ', ' +
              data[i].address +
              '</p> <span><a href="tel:' +
              data[i].phone +
              '"><i class="fa fa-phone"></i> - ' +
              data[i].phone +
              '</a></span> </div> </div> </div> </div>'
          );

          $('#searchResult').append($newstr);
        }
      },
      error: function (xhr, data, err) {
        console.log(err);
        displayErrorToast('No result found! Search with different keywords!');
      }
    });

    var my_element = document.getElementById('searchResult');
    my_element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest'
    });
    console.log('clicked');
    document.getElementById('searchBtn').classList.remove('is-outlined');
    document.getElementById('searchBtn').classList.add('is-loading');
  }
}

function productDetail(id) {
  console.log('CLICKED', id);

  $.ajax({
    url: API_BASE_URL + 'vendor/' + id + '/',
    method: 'GET',
    success: function (data, status, xhr) {
      console.log(data.products);
    },
    error: function (xhr, status, err) {
      console.log(err, 'ERROR');
    }
  });
}

var oldName;
var oldPhone;
var oldProducts;
var oldAddress;
var oldCity;
var oldPincode;
var oldDetails;

var oldData = {
  name: '',
  phone: '',
  products: '',
  address: '',
  city: '',
  pincode: '',
  details: ''
};

function editBussiness(id) {
  document.getElementById('editBtn' + id).classList.add('hideme');
  document.getElementById('updateBtn' + id).classList.remove('hideme');

  document.getElementById('name' + id).removeAttribute('disabled');
  document.getElementById('phone' + id).removeAttribute('disabled');
  document.getElementById('products' + id).removeAttribute('disabled');
  document.getElementById('address' + id).removeAttribute('disabled');
  document.getElementById('city' + id).removeAttribute('disabled');
  document.getElementById('pincode' + id).removeAttribute('disabled');
  document.getElementById('details' + id).removeAttribute('disabled');
  oldName = document.getElementById('name' + id).value;
  oldPhone = document.getElementById('phone' + id).value;
  oldProducts = document.getElementById('products' + id).value;
  oldAddress = document.getElementById('address' + id).value;
  oldCity = document.getElementById('city' + id).value;
  oldPincode = document.getElementById('pincode' + id).value;
  oldDetails = document.getElementById('details' + id).value;

  oldData = {
    name: oldName,
    phone: oldPhone,
    products: oldProducts,
    address: oldAddress,
    city: oldCity,
    pincode: oldPincode,
    details: oldDetails
  };

  console.log(oldData);
}

function updateBussiness(id) {
  const newName = document.getElementById('name' + id).value;
  const newPhone = document.getElementById('phone' + id).value;
  const newProducts = document.getElementById('products' + id).value;
  const newAddress = document.getElementById('address' + id).value;
  const newCity = document.getElementById('city' + id).value;
  const newPincode = document.getElementById('pincode' + id).value;
  const newDetails = document.getElementById('details' + id).value;

  const dataForApiRequest = {
    name: newName,
    phone: newPhone,
    products: newProducts,
    address: newAddress,
    city: newCity,
    pincode: newPincode,
    details: newDetails
  };

  if(JSON.stringify(dataForApiRequest)===JSON.stringify(oldData)){
    document.getElementById('editBtn' + id).classList.remove('hideme');
    document.getElementById('updateBtn' + id).classList.add('hideme');
    document.getElementById('name' + id).setAttribute('disabled', '');
    document.getElementById('phone' + id).setAttribute('disabled', '');
    document.getElementById('products' + id).setAttribute('disabled', '');
    document.getElementById('address' + id).setAttribute('disabled', '');
    document.getElementById('city' + id).setAttribute('disabled', '');
    document.getElementById('pincode' + id).setAttribute('disabled', '');
    document.getElementById('details' + id).setAttribute('disabled', '');
    displaySuccessToast("Updated successfully!");
  }
  else{
    $.ajax({
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      url: API_BASE_URL + 'vendor/' + id + '/',
      method: 'PATCH',
      data: dataForApiRequest,
      success: function (data, status, xhr) {
        document.getElementById('editBtn' + id).classList.remove('hideme');
        document.getElementById('updateBtn' + id).classList.add('hideme');
        document.getElementById('name' + id).setAttribute('disabled', '');
        document.getElementById('phone' + id).setAttribute('disabled', '');
        document.getElementById('products' + id).setAttribute('disabled', '');
        document.getElementById('address' + id).setAttribute('disabled', '');
        document.getElementById('city' + id).setAttribute('disabled', '');
        document.getElementById('pincode' + id).setAttribute('disabled', '');
        document.getElementById('details' + id).setAttribute('disabled', '');
        displaySuccessToast("Updated successfully!");
      },
      error: function (xhr, status, err) {
        displayErrorToast('Not successfull, try again!');
      }
    });
  }
}

function formFieldsAreValid(
  name,
  phone,
  products,
  address,
  city,
  pincode,
  details
) {
  if (
    name === '' ||
    phone === '' ||
    products === '' ||
    address === '' ||
    city === '' ||
    pincode === '' ||
    details === ''
  ) {
    displayErrorToast('Please do not leave parameter empty!');
    return false;
  }
  if (phone.length !== 10 || !/^\d+$/.test(phone)) {
    displayErrorToast('Please enter phone number in correct format!');
    return false;
  }
  if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
    displayErrorToast('Please enter pincode in correct format!');
    return false;
  }
  return true;
}
function addBussiness() {
  var Name = document.getElementById('nameInput').value;
  var Phone = document.getElementById('phoneInput').value;
  var Products = document.getElementById('productsInput').value;
  var Address = document.getElementById('addressInput').value;
  var City = document.getElementById('cityInput').value;
  var Pincode = document.getElementById('pincodeInput').value;
  var Details = document.getElementById('detailsInput').value;

  dataForApiRequest = {
    name: Name,
    phone: Phone,
    products: Products,
    address: Address,
    city: City,
    pincode: Pincode,
    details: Details
  };

  if (
    formFieldsAreValid(Name, Phone, Products, Address, City, Pincode, Details)
  ) {
    document.getElementById('addBtn').classList.remove('is-light');
    document.getElementById('addBtn').classList.add('is-loading');
    $.ajax({
      headers: {
        Authorization: 'Token ' + localStorage.getItem('token')
      },
      method: 'POST',
      url: API_BASE_URL + 'vendor/create/',
      data: dataForApiRequest,
      success: function (data, status, xhr) {
        console.log(data);
        getBussiness(
          document.getElementById('content-registered').childElementCount
        );
        displaySuccessToast('Bussiness added successfully!');
        var Name = (document.getElementById('nameInput').value = '');
        var Phone = (document.getElementById('phoneInput').value = '');
        var Products = (document.getElementById('productsInput').value = '');
        var Address = (document.getElementById('addressInput').value = '');
        var City = (document.getElementById('cityInput').value = '');
        var Pincode = (document.getElementById('pincodeInput').value = '');
        var Details = (document.getElementById('detailsInput').value = '');
        document.getElementById('addBtn').classList.add('is-light');
        document.getElementById('addBtn').classList.remove('is-loading');
      },
      error: function (xhr, status, err) {
        displayErrorToast('Some error occured, please try again later!');
        document.getElementById('addBtn').classList.add('is-light');
        document.getElementById('addBtn').classList.remove('is-loading');
      }
    });
  }
}
