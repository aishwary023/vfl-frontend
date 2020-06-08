$(document).ready(function () {

    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function () {

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        $(".navbar-burger").toggleClass("is-active");
        $(".navbar-menu").toggleClass("is-active");

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
    const username = document.getElementById("inputUsername").value;

    const password = document.getElementById("inputPassword").value;

    if (username.length > 0 && password.length > 0 && password.trim() !== "") {
        const dataForApiRequest = {
            username: username,
            password: password
        }
        document.getElementById("loginBtn").classList.remove("is-outlined")
        document.getElementById("loginBtn").classList.add("is-loading")
        $.ajax({
            url: API_BASE_URL + 'auth/login/',
            method: 'POST',
            data: dataForApiRequest,
            success: function (data, status, xhr) {
                localStorage.setItem('token', data.token);

                window.location.href = '/dashboard/index.html';

            },
            error: function (xhr, status, err) {
                displayErrorToast('No Account Found. Click on register to create account');
                document.getElementById("loginBtn").classList.add("is-outlined")
                document.getElementById("loginBtn").classList.remove("is-loading")
            }
        })
    }
    else {
        displayErrorToast("Please enter valid credentials!");
    }

}

function logout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}
function registerFieldsAreValid(firstName, lastName, email, username, password) {
    if (firstName === '' || lastName === '' || email === '' || username === '' || password === '') {
        displayErrorToast("Please fill all the fields correctly.");
        return false;
    }
    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
        displayErrorToast("Please enter a valid email address.")
        return false;
    }
    if (username.trim().length < 8) {
        displayErrorToast("Username must be of 8 characters or more!");
        return false;
    }
    if (password.trim().length < 8) {
        displayErrorToast("Password must be of 8 characters or more!");
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
        displayInfoToast("Please wait...");

        const dataForApiRequest = {
            name: firstName + " " + lastName,
            email: email,
            username: username,
            password: password
        }

        document.getElementById("registerBtn").classList.remove("is-outlined")
        document.getElementById("registerBtn").classList.add("is-loading")

        $.ajax({
            url: API_BASE_URL + 'auth/register/',
            method: 'POST',
            data: dataForApiRequest,
            success: function (data, status, xhr) {
                localStorage.setItem('token', data.token);
                window.location.href = '/dashboard/index.html';
            },
            error: function (xhr, status, err) {
                displayErrorToast('An account using same email or username is already created');
                document.getElementById("registerBtn").classList.add("is-outlined")
                document.getElementById("registerBtn").classList.remove("is-loading")
            }
        })
    }
}

$(function () {
    $("#tags").autocomplete({
        source: availableTags
    });
});

function searchFieldsAreValid(city, products) {
    if (city === '') {
        displayErrorToast("Please do not leave city parameter empty!")
        return false
    }
    return true
}

window.onload = function () {
    document.getElementById("tags").addEventListener("keyup", function (e) {
        if (e.which === 13) {
            console.log("CLICKED")
            search()
        }


    })
    document.getElementById("productsText").addEventListener("keyup", function (e) {
        if (e.which === 13)
            search()
    })
}

function search() {
    const city = document.getElementById("tags").value
    const products = document.getElementById("productsText").value

    if (searchFieldsAreValid(city, products)) {

        document.getElementById("searchParent").innerHTML = '<div class="columns is-multiline" id="searchResult"></div>'
        document.getElementById("searchBtn").classList.remove("is-outlined")
        document.getElementById("searchBtn").classList.add("is-loading")

        $.ajax({
            url: API_BASE_URL + 'vendor/?city=' + city + '&products=' + products,
            method: "GET",
            success: function (data, status, xhr) {
                console.log(data)

                for (var i = 0; i < data.length; i++) {
                    var $newstr = $('  <div class="column is-4"> <div class="card"> <div class="card-content"> <div class="media"> <div class="media-left"> <figure class="image is-48x48"> <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image"> </figure> </div> <div class="media-content"> <a id="1"> <p class="title is-4">' + data[i].name + '</p> </a> </div> </div> <div class="content contentCard">' + data[i].details + '<br> <hr> <p>' + data[i].city + ', ' + data[i].address + '</p> <span><a href="tel:' + data[i].phone + '"><i class="fa fa-phone"></i> - ' + data[i].phone + '</a></span> </div> </div> </div> </div>')

                    $("#searchResult").append($newstr)
                }
            },
            error: function (xhr, data, err) {
                console.log(err)
                displayErrorToast('No result found! Search with different keywords!');

            }
        })

        document.getElementById("searchBtn").classList.add("is-outlined")
        document.getElementById("searchBtn").classList.remove("is-loading")
        var my_element = document.getElementById("searchResult");
        my_element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "nearest"
        });
        console.log("clicked")
    }

}

function productDetail(id) {
    console.log("CLICKED", id)

    $.ajax({
        url: API_BASE_URL + 'vendor/' + id + '/',
        method: "GET",
        success: function (data, status, xhr) {
            console.log(data.products)
        },
        error: function (xhr, status, err) {
            console.log(err, "ERROR")
        }
    })
}