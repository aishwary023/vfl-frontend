function getBussiness(x) {
    $.ajax({
        url: API_BASE_URL + 'vendor/specific/',
        method: "GET",
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        success: function (data, status, xhr) {


            $("#parent-registered").append('<div class="columns is-multiline" id="content-registered" ></div>')

            for (var i = x; i < data.length; i++) {



                var $newstr = $(' <div id="' + data[i].id + '" class="column is-3 is-offset-2" style="box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2); transition: 0.3s; "> <div class="field is-horizontal"> <div class="field-body"> <div class="field"> <p class="control is-expanded has-icons-left"> <input id="name' + data[i].id + '" disabled class="input" type="text" placeholder="Your Name or Business name" value="' + data[i].name + '"> <span class="icon is-small is-left"> <i class="fa fa-user"></i> </span> </p> </div> <div class="field is-expanded"> <div class="field has-addons"> <p class="control"> <a class="button is-static"> +91 </a> </p> <p class="control is-expanded"> <input id="phone' + data[i].id + '" disabled class="input" type="tel" placeholder="Your phone number" value="' + data[i].phone + '"> </p> </div> </div> </div> </div> <div class="field is-horizontal"> <div class="field-body"> <div class="field"> <p class="control is-expanded"> <input id="products' + data[i].id + '" disabled class="input is-success" type="text" placeholder="Enter products seperated by commas" value="' + data[i].products + '"> </p> </div> </div> </div> <div class="field is-horizontal"> <div class="field-body"> <div class="field"> <p class="control is-expanded"> <input disabled id="address' + data[i].id + '" class="input is-success" type="text" placeholder="Enter Address" value="' + data[i].address + '"> </p> </div> </div> </div> <div class="field is-horizontal"> <div class="field-body"> <div class="field"> <div class="control"> <input disabled id="city' + data[i].id + '" class="input" type="text" placeholder="Enter City" value="' + data[i].city + '"> </div> </div> <div class="field"> <div class="control"> <input disabled id="pincode' + data[i].id + '" class="input" type="text" placeholder=" Enter pincode" pattern="[0-9]*" value="' + data[i].pincode + '"> </div> </div> </div> </div> <div class="field is-horizontal"> <div class="field-body"> <div class="field"> <div class="control"> <textarea disabled id="details' + data[i].id + '" class="textarea" placeholder="Give details about your bussiness" style="border-color: #00D1B3;">' + data[i].details + '</textarea> </div> </div> </div> </div> <div class="field is-horizontal"> <div class="field-body"> <div class="field"> <div class="control"> <button class="button is-success is-fullwidth is-light" id="editBtn' + data[i].id + '" onclick="editBussiness(' + data[i].id + ')"> Edit Business! </button> <button class="button is-success is-fullwidth is-light hideme" onclick="updateBussiness(' + data[i].id + ')" id="updateBtn' + data[i].id + '"> Update </button> </div> </div> </div> </div> </div>');
                $("#content-registered").append($newstr)
            }

        },
        error: function (xhr, data, err) {
            console.log(err)
            displayErrorToast('No result found!');

        }
    })
}

window.onload = getBussiness(0)


$.ajax({
    headers: {
        Authorization: 'Token ' + localStorage.getItem('token'),
    },
    url: API_BASE_URL + 'auth/profile/',
    method: 'GET',
    success: function (data, status, xhr) {
        document.getElementById("name-parent").innerHTML = ' <img id="profile-img" src="" alt="" srcset="">' + '&nbsp;' + data.name + ''
        document.getElementById("profile-img").src = 'https://ui-avatars.com/api/?rounded=true&name=' + data.name + '&background=00D1B3&size=33&color=00000'
    }
})