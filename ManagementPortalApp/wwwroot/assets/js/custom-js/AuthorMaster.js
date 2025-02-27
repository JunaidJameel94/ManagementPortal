$(document).ready(function () {
    GetAuthor();

    $('#SaveBtn').click(function () {
        SaveAuthor();
    });
    $('#UpdateBtn').click(function () {
        UpdateAuthor();
    });
});

function GetAuthor() {
    UTILITY.CheckSession((data_) => {

        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetALLAuthor'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    $('#Author-master tbody').html('');
                    if (result.data != null) {
                        $.each(result.data, function (i, option) {
                            if (option.isdeleted == 0) {
                                var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-info Editslugs" data-value="' + option.id + '" type="button"><i class="feather-edit-3"></i></button></td>' : '';
                                var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-danger Deleteslugs"  data-value="' + option.id + '" type="button"><i class="feather-trash"></i></button></td>' : '';

                                $('#Author-master tbody').append(
                                    '<tr id="rowid-' + i + '">' +
                                    '<td>' + option.id + '</td>' +
                                    '<td>' + option.authorname + '</td>' +
                                    UpdateBtn +
                                    DeleteBtn +
                                    '</tr>'
                                );
                            }
                            
                        });

                        $('.Editslugs').on('click', function () {
                            EditAuthor(this.attributes["data-value"].value);
                        });

                        $('.Deleteslugs').on('click', function () {
                            DeleteAuthor(this.attributes["data-value"].value);
                        });
                    }
                    $('#Author-master').DataTable();
                    HideLoader('RolesMasterDiv');

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
function EditAuthor(id) {
    new APICALL(GetGlobalURL('Base', 'GetAuthorByID?AuthorID=' + id), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data.length > 0) {
                var AuthorID = result.data[0].id;
                var AuthorName = result.data[0].authorname;
                var IsActive = result.data[0].isactive;

                $('#AuthorID').val(AuthorID);
                $('#AuthorName').val(AuthorName);
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
function UpdateAuthor() {
    var AuthorID = $('#AuthorID').val();
    var AuthorName = $('#AuthorName').val();
    var IsActive = $('#IsActive').is(':checked');
    var modalupdate = JSON.stringify({
        AuthorID: AuthorID,
        AuthorName: AuthorName,
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

            new APICALL(GetGlobalURL('Base', 'EditAuthor'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv');

                if (result) {
                    GetAuthor();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Authot updated successfully!',
                    });
                    $('#AuthorID').val('');
                    $('#AuthorName').val('');
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
function SaveAuthor() {
    var AuthorName = $('#AuthorName').val();
    var IsActive = $('#IsActive').is(':checked');

    if (!AuthorName) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid Name.',
            footer: ''
        });
        return;
    }
    var modal = JSON.stringify({
        AuthorName: AuthorName,
        IsActive: IsActive,
    });
    new APICALL(GetGlobalURL('Base', 'SaveAuthor'), 'POST', modal, true).FETCH((result, error) => {
        if (result) {
            GetAuthor();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Author saved successfully!',
                footer: ''
            });
            $('#AuthorID').val('');
            $('#AuthorName').val('');
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
function DeleteAuthor(id) {
    var modalupdate = JSON.stringify({
        AuthorID: id
    });

    Swal.fire({
        title: 'Do you want to Delete the Author?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('UserListDiv');

            new APICALL(GetGlobalURL('Base', 'DeleteAuthor'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv');

                if (result) {
                    GetAuthor();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Author Delete successfully!',
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