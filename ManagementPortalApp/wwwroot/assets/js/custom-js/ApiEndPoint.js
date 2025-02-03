$(document).ready(function () {
    GetApiEndPoints();

    $('#SaveBtn').click(function () {
        SaveAPIEndPoint();
    });
    $('#UpdateBtn').click(function () {
        UpdateEndPoint();
    });
});

function GetApiEndPoints() {
    UTILITY.CheckSession((data_) => {

        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetApiEndPoint'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    $('#apiendpointTable tbody').html('');
                    if (result.data != null) {
                        $.each(result.data, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-info EditEndPoint" data-value="' + option.apimoduleid + '" type="button"><i class="feather-edit-3"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-danger DeleteEndPoint"  data-value="' + option.apimoduleid + '" type="button"><i class="feather-trash"></i></button></td>' : '';

                            $('#apiendpointTable tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.modulename + '</td>' +
                                '<td class="w-25">' + (option.apimoduleid != null ? option.apidelay : '-') + '</td>' +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });

                        $('.EditEndPoint').on('click', function () {
                            EditEndPoint(this.attributes["data-value"].value);
                        });

                        $('.DeleteEndPoint').on('click', function () {
                            DeleteEndPoint(this.attributes["data-value"].value);
                        });
                    }
                    $('#apiendpointTable').DataTable();
                    HideLoader('UserListDiv');

                }
                if (error) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
            });
        }
    });
}
function EditEndPoint(ApiModuleID) {

    new APICALL(GetGlobalURL('Base', 'GetApiEndPointByID?ApiModuleID=' + ApiModuleID), 'GET', '', true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var ApiModuleID = result.data[0].apimoduleid;
                var ModuleName = result.data[0].modulename;
   
                var ApiDelay = result.data[0].apidelay;

                $('#EndPointID').val(ApiModuleID);
                $('#EndPointName').val(ModuleName);
                $('#ApiDelay').val(ApiDelay);


                if ($('.updatebutton').hasClass('d-none')) {
                    $('.savebutton').toggleClass('d-none');
                    $('.updatebutton').toggleClass('d-none');
                }
            }
        }
        if (error) {

            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: error.data.responseText,
                footer: ''
            });
        }
    });
} 
function UpdateEndPoint() {
    var ApiModuleID = $('#EndPointID').val();
    var ModuleName = $('#EndPointName').val();
    var ApiDelay = $('#ApiDelay').val();



    var modalupdate = JSON.stringify({
        ApiModuleID: ApiModuleID,
        ModuleName: ModuleName,
        ApiDelay: ApiDelay
    });

    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('UserListDiv');

            new APICALL(GetGlobalURL('Base', 'EditApiEndPoint'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv'); // Always hide loader

                if (result) {
                    GetApiEndPoints();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'API EndPoint updated successfully!',
                    });
                    $('#EndPointName').val('');
                    $('#ApiDelay').val('');
                } else if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: errorMessage,
                    });
                }
            });
        }
    });
}
function SaveAPIEndPoint() {
    var ModuleName = $('#EndPointName').val();
    var ApiDelay = $('#ApiDelay').val();

    if (!EndPointName) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid End Point Name.',
            footer: ''
        });
        return;
    }
    var modal = JSON.stringify({
        ModuleName: ModuleName,
        ApiDelay: ApiDelay
    });
    new APICALL(GetGlobalURL('Base', 'SaveApiEndPoint'), 'POST', modal, true).FETCH((result, error) => {
        if (result) {
            GetApiEndPoints();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'API EndPoint saved successfully!',
                footer: ''
            });
            $('#EndPointName').val('');
            $('#ApiDelay').val('');
        } else if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error...',
                text: errorMessage,
                footer: ''
            });
        }
    });
}
function DeleteEndPoint(ApiModuleID) {
    var modalupdate = JSON.stringify({
        ApiModuleID: ApiModuleID
    });

    Swal.fire({
        title: 'Do you want to Delete the API EndPoint?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('UserListDiv');

            new APICALL(GetGlobalURL('Base', 'DeleteApiEndPoint'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv');

                if (result) {
                    GetApiEndPoints();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'API EndPoint Delete successfully!',
                    });
                } else if (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: errorMessage,
                    });
                }
            });
        }
    });
}