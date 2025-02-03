var RoleID = "";
$(document).ready(function () {

    RoleID = $('#RoleID').val();
    $('.nav-link.parent').click(function () {
        $(this).find('.toggleClassParent').toggleClass('bx-chevron-right');
        $(this).find('.toggleClassParent').toggleClass('bx-chevron-down');
    });
});


//$(document).on('shown.bs.modal', function (e) {
//    $('body').removeClass('modal-open');
//});


function GetGlobalSignalRURL() {

    var LocalUrl = 'localhost:7201'; //view

    FinalUrl = GetProtocolURL() + LocalUrl + "/signalr";

    return FinalUrl;
}


function GetViewURL() {

    var LocalUrl = 'localhost:7201'; //view

    FinalUrl = GetProtocolURL() + LocalUrl + "/";

    return FinalUrl;
}


function GetGlobalServiceURL(pServiceName, pMethodName) {

    var LocalUrl = 'localhost:7163'; // apiurl

    FinalUrl = GetProtocolURL() + LocalUrl + "/api/" + pServiceName + "/" + pMethodName;

    return FinalUrl;
}

function GetGlobalURL(pControllerName, pMethodName) {

    var LocalUrl = 'localhost:7201';

    FinalUrl = GetProtocolURL() + LocalUrl + "/" + pControllerName + "/" + pMethodName;

    return FinalUrl;
}

function GetProtocolURL() {

    var FinalProtocol = "";

    if (document.location.protocol === 'https:') {
        FinalProtocol = 'https://';
    }
    else {
        FinalProtocol = 'http://';
    }

    return FinalProtocol;
}
function ShowLoader(divid) {
    $('#' + divid + ' .loader-wrapper').removeClass('d-none');
}

function HideLoader(divid) {
    $('#' + divid + ' .loader-wrapper').addClass('d-none');
}
function removeToast(id) {
    $('.c_toast_' + id).remove();
}