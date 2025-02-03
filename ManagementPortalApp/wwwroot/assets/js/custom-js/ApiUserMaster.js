$(document).ready(function () {
    GetSlugtype_DD();
    GetApiUser();

    $('#SaveBtn').click(function () {
        SaveApiUser();
    });
    $('#UpdateBtn').click(function () {
        UpdateApiUser();
    });
});
function GetApiUser() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetApiUser'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    $('#apiUserTable tbody').html(''); // Clear the table body
                    if (result.data != null) {
                        $.each(result.data, function (i, option) {
                            // Generate Update and Delete buttons based on permissions
                            var UpdateBtn = (data_[0].AllowUpdate == true) ?
                                '<td><button class="btn btn-sm btn-info EditApiUser" data-value="' + option.userid + '" type="button"><i class="feather-edit-3"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ?
                                '<td><button class="btn btn-sm btn-danger DeleteApiUser" data-value="' + option.userid + '" type="button"><i class="feather-trash"></i></button></td>' : '';

                            // Append the row with proper <td> formatting
                            $('#apiUserTable tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + (option.username != null ? option.username : '-') + '</td>' +
                                '<td>' + (option.useremail != null ? option.useremail : '-') + '</td>' +

                                //'<td>' + (option.userpassword != null ? option.userpassword : '-') + '</td>' +
                                '<td>' + (option.modulename != null ? option.modulename : '-') + '</td>' +
                                '<td>' + (option.isactive != null && option.isactive == true ? 'Active' : 'Inactive') + '</td>' +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });

                        // Attach click events for Edit and Delete buttons
                        $('.EditApiUser').on('click', function () {
                            EditApiUser(this.attributes["data-value"].value);
                        });

                        $('.DeleteApiUser').on('click', function () {
                            DeleteApiUser(this.attributes["data-value"].value);
                        });
                    }

                    // Initialize DataTable
                    $('#apiUserTable').DataTable();
                    HideLoader('UserListDiv'); // Hide the loader

                } else if (error) {
                    // Handle errors
                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data?.responseText || 'An error occurred while fetching data.',
                        footer: ''
                    });
                }
            });
        }
    });
}

function GetSlugtype_DD() {
    new APICALL(GetGlobalURL('Base', 'GetApiEndPoint'), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                $('#AccessLevel').append('<option hidden="true">Select Access Level</option>');
                $.each(result.data, function (i, option) {
                    $('#AccessLevel').append(
                        '<option value="' + option.apimoduleid + '">' + option.modulename + '</option>'
                    );
                });
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
function EditApiUser(UserID) {

    new APICALL(GetGlobalURL('Base', 'GetApiUserByID?UserID=' + UserID), 'GET', '', true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var UserID = result.data[0].userid;
                var UserName = result.data[0].username;
                var UserEmail = result.data[0].useremail;
                //var UserPassword = result.data[0].userpassword;

                var AccessLevel = result.data[0].accesslevel;
                var IsActive = result.data[0].isactive;

                $('#EditUserID').val(UserID);
                $('#UserName').val(UserName);
                $('#UserEmail').val(UserEmail);
                //$('#UserPassword').val(UserPassword);
                $('#AccessLevel').val(AccessLevel);
                $('#IsActive').val(IsActive);
                $('#IsActive').prop('checked', IsActive);


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
function UpdateApiUser() {
    var EditUserID  = $('#EditUserID').val();
    var UserName = $('#UserName').val();
    var UserEmail = $('#UserEmail').val();
    var UserPassword = $('#UserPassword').val();
    var AccessLevel = $('#AccessLevel').val();
    var IsActive = $('#IsActive').is(':checked');



    var modalupdate = JSON.stringify({
        UserID: EditUserID,
        UserName: UserName,
        UserEmail: UserEmail,
        UserPassword: UserPassword,
        AccessLevel: AccessLevel,
        IsActive: IsActive,
    });

    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('UserListDiv');

            new APICALL(GetGlobalURL('Base', 'EditApiUser'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv'); 

                if (result) {
                    GetApiUser();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'API EndPoint updated successfully!',
                    });
                    $('#EditUserID').val('');
                    $('#UserName').val('');
                    $('#UserEmail').val('');
                    $('#UserPassword').val('');
                    $('#AccessLevel').val('');
                    $('#IsActive').prop('checked', false);
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
function SaveApiUser() {
    var UserName = $('#UserName').val();
    var UserEmail = $('#UserEmail').val();
    var UserPassword = $('#UserPassword').val();
    var AccessLevel = $('#AccessLevel').val();
    var IsActive = $('#IsActive').is(':checked');

    if (!UserName) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid Name.',
            footer: ''
        });
        return;
    }
    var modal = JSON.stringify({
        UserName: UserName,
        UserEmail: UserEmail,
        UserPassword: UserPassword,
        AccessLevel: AccessLevel,
        IsActive: IsActive
    });
    new APICALL(GetGlobalURL('Base', 'SaveApiUser'), 'POST', modal, true).FETCH((result, error) => {
        if (result) {
            GetApiUser();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Api User saved successfully!',
                footer: ''
            });
            $('#EditUserID').val('');
            $('#UserName').val('');
            $('#UserEmail').val('');
            $('#UserPassword').val('');
            $('#AccessLevel').val('');
            $('#IsActive').prop('checked', false);
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
function DeleteApiUser(ApiUserID) {
    var modalupdate = JSON.stringify({
        ApiUserID: ApiUserID
    });

    Swal.fire({
        title: 'Do you want to Delete the API EndPoint?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('UserListDiv');

            new APICALL(GetGlobalURL('Base', 'DeleteApiUser'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv');

                if (result) {
                    GetApiUser();
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