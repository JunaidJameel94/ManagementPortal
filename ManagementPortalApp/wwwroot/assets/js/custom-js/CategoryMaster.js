$(document).ready(function () {
    GetCategory();
    $('#SaveBtn').click(function () {
        SaveCategory();
    });
    $('#UpdateBtn').click(function () {
        UpdateCategory();
    });
});

function GetCategory() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetALLCategory'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    $('#Category-master tbody').html('');
                    if (result.data != null) {
                        $.each(result.data, function (i, option) {
                            if (option.isActive == 1) {
                                var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-info EditsCategory" data-value="' + option.cat_id + '" type="button"><i class="feather-edit-3"></i></button></td>' : '';
                                var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-danger DeleteCategory"  data-value="' + option.cat_id + '" type="button"><i class="feather-trash"></i></button></td>' : '';
                                $('#Category-master tbody').append(
                                    '<tr id="rowid-' + i + '">' +
                                    '<td>' + option.cat_id + '</td>' +
                                    '<td>' + option.category_name + '</td>' +
                                    UpdateBtn +
                                    DeleteBtn +
                                    '</tr>'
                                );
                            }
                        });
                        $('.EditsCategory').on('click', function () {
                            EditCategory(this.attributes["data-value"].value);
                        });
                        $('.DeleteCategory').on('click', function () {
                            DeleteCategory(this.attributes["data-value"].value);
                        });
                    }
                    $('#Category-master').DataTable();
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
function EditCategory(cat_id) {
    new APICALL(GetGlobalURL('Base', 'GetCategoryByID?CategoryID=' + cat_id), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data.length > 0) {
                var CategoryID = result.data[0].cat_id;
                var CategoryName = result.data[0].category_name;
                var IsActive = result.data[0].isActive;
                $('#CategoryID').val(CategoryID);
                $('#CategoryName').val(CategoryName);
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
function UpdateCategory() {
    var CategoryID = $('#CategoryID').val();
    var CategoryName = $('#CategoryName').val();
    var IsActive = $('#IsActive').is(':checked');
    var modalupdate = JSON.stringify({
        CategoryID: CategoryID,
        CategoryName: CategoryName,
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
            new APICALL(GetGlobalURL('Base', 'EditCategory'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv');
                if (result) {
                    GetCategory();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Category updated successfully!',
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
function SaveCategory() {
    var CategoryName = $('#CategoryName').val();
    var IsActive = $('#IsActive').is(':checked');
    if (!CategoryName) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid Name.',
            footer: ''
        });
        return;
    }
    var modal = JSON.stringify({
        CategoryName: CategoryName,
        IsActive: IsActive,
    });
    new APICALL(GetGlobalURL('Base', 'SaveCategory'), 'POST', modal, true).FETCH((result, error) => {
        if (result) {
            GetCategory();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Category saved successfully!',
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
function DeleteCategory(cat_id) {
    var modalupdate = JSON.stringify({
        CategoryID: cat_id
    });
    Swal.fire({
        title: 'Do you want to Delete the Author?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('UserListDiv');
            new APICALL(GetGlobalURL('Base', 'DeleteCategory'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('UserListDiv');
                if (result) {
                    GetCategory();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Category Delete successfully!',
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