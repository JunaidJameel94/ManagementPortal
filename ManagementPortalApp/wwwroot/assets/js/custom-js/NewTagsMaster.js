$(document).ready(function () {
    GetNewsTags();
    GetTagtype_DD();
    $('#SaveBtn').click(function () {
        SaveMasterTags();
    });

    $('#UpdateBtn').click(function () {
        UpdateTags();
    });
})


function GetNewsTags() {
    UTILITY.CheckSession((data_) => {

        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetNewsTags'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    $('#NewsTags-master tbody').html('');
                    if (result.data != null) {
                        $.each(result.data, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-info EditTags" data-value="' + option.ID + '" type="button"><i class="feather-edit-3"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-danger DeleteTags"  data-value="' + option.ID + '" type="button"><i class="feather-trash"></i></button></td>' : '';

                            $('#NewsTags-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.TagName + '</td>' +
                                '<td>' + (option.TypeName != null ? option.TypeName : '-') + '</td>' +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });

                        $('.EditTags').on('click', function () {
                            EditTags(this.attributes["data-value"].value);
                        });

                        $('.DeleteTags').on('click', function () {
                            DeleteTags(this.attributes["data-value"].value);
                        });
                    }
                    $('#NewsTags-master').DataTable();
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

function GetTagtype_DD() {
    new APICALL(GetGlobalURL('Base', 'GetTagType'), 'GET', '', true).FETCH((result, error) => {

        if (result) {
            if (result.data != null) {
                $('#TagTypeID').append('<option hidden="true" value="">Select Tag Type</option>');
                $.each(result.data, function (i, option) {
                    $('#TagTypeID').append(
                        '<option value="' + option.TypeID + '" required>' + option.TypeName + '</option>'
                    );
                });

                // Set "Open" (TypeID = 3) as the default selection
                $('#TagTypeID').val(3);
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
function EditTags(TagID) {

    new APICALL(GetGlobalURL('Base', 'GetTagsByID?TagID=' + TagID), 'GET', '', true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var RoleName = result.data[0].TagName;
                var TagTypeID = result.data[0].TypeID;
                var ID = result.data[0].ID;

                $('#TagName').val(RoleName);
                $('#TagTypeID').val(TagTypeID);
                $('#TagID').val(ID);


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

function UpdateTags() {
    var TagID = $('#TagID').val();
    var TagName = $('#TagName').val().trim();
    var TagTypeID = $('#TagTypeID').val();

    var modalupdate = JSON.stringify({
        TagID: TagID,
        TagName: TagName,
        TypeID: TagTypeID
    });

    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('RolesMasterDiv');

            new APICALL(GetGlobalURL('Base', 'EditTags'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('RolesMasterDiv'); // Always hide loader

                if (result) {
                    GetNewsTags();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Tags updated successfully!',
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

function DeleteTags(TagID) {
    var modalupdate = JSON.stringify({
        TagID: TagID
    });

    Swal.fire({
        title: 'Do you want to Delete the Tags?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('RolesMasterDiv');

            new APICALL(GetGlobalURL('Base', 'DeleteTags'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('RolesMasterDiv'); // Always hide loader

                if (result) {
                    GetNewsTags();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Tags Delete successfully!',
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

function SaveMasterTags() {
    var TagName = $('#TagName').val().trim(); 
    var TagTypeID = $('#TagTypeID').val();
    var UserID = $('#UserID').val();

    // Validate inputs
    if (!TagName) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid Tag Name.',
            footer: ''
        });
        return;
    }
    if (!TagTypeID) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid Tag Type.',
            footer: ''
        });
        return;
    }



    // Create payload
    var modal = JSON.stringify({
        TagName: TagName,
        TypeID: TagTypeID,
        UserID: UserID
    });

    // API Call
    new APICALL(GetGlobalURL('Base', 'SaveNewsTags'), 'POST', modal, true).FETCH((result, error) => {
        if (result) {
            GetNewsTags();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'News Tags saved successfully!',
                footer: ''
            });

            // Optionally clear the input field after saving
            $('#TagName').val('');
            $('#TagTypeID').val('');
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

