$(document).ready(function () {
    GetNewsSlugs();
    GetSlugtype_DD();
    $('#SaveBtn').click(function () {
        SaveMasterSlugs();
    });
    $('#UpdateBtn').click(function () {
        UpdateSlugs();
    });
});

function GetNewsSlugs() {
    UTILITY.CheckSession((data_) => {

        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetSlugs'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    $('#Slug-master tbody').html('');
                    if (result.data != null) {
                        $.each(result.data, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-info Editslugs" data-value="' + option.SlugID + '" type="button"><i class="feather-edit-3"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-danger Deleteslugs"  data-value="' + option.SlugID + '" type="button"><i class="feather-trash"></i></button></td>' : '';

                            $('#Slug-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.SlugName + '</td>' +
                                '<td>' + (option.TypeName != null ? option.TypeName : '-') + '</td>' +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });

                        $('.Editslugs').on('click', function () {
                            EditSlugs(this.attributes["data-value"].value);
                        });

                        $('.Deleteslugs').on('click', function () {
                            Deleteslugs(this.attributes["data-value"].value);
                        });
                    }
                    $('#Slug-master').DataTable();
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
function GetSlugtype_DD() {
    new APICALL(GetGlobalURL('Base', 'GetSlugType'), 'GET', '', true).FETCH((result, error) => {

        if (result) {
            if (result.data != null) {
                // Populate the dropdown
                $('#SlugTypeID').append('<option hidden="true" value="">Select Slug Type</option>');
                $.each(result.data, function (i, option) {
                    $('#SlugTypeID').append(
                        '<option value="' + option.TypeID + '">' + option.TypeName + '</option>'
                    );
                });

                // Set "Open" (TypeID = 3) as the default selection
                $('#SlugTypeID').val(3);
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
function EditSlugs(SlugID) {

    new APICALL(GetGlobalURL('Base', 'GetSlugsByID?SlugID=' + SlugID), 'GET', '', true).FETCH((result, error) => {

        if (result) {

            if (result.data.length > 0) {

                var SlugName = result.data[0].SlugName;
                var SlugTypeID = result.data[0].TypeID;
                var SlugID = result.data[0].SlugID;

                $('#SlugName').val(SlugName);
                $('#SlugTypeID').val(SlugTypeID);
                $('#SlugID').val(SlugID);


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
function UpdateSlugs() {
    var SlugID = $('#SlugID').val();
    var SlugName = $('#SlugName').val().trim();
    var SlugTypeID = $('#SlugTypeID').val();

    var modalupdate = JSON.stringify({
        SlugID: SlugID,
        SlugName: SlugName,
        TypeID: SlugTypeID
    });

    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('RolesMasterDiv');

            new APICALL(GetGlobalURL('Base', 'EditSlugs'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('RolesMasterDiv'); // Always hide loader

                if (result) {
                    GetNewsSlugs();
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Slugs updated successfully!',
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
function SaveMasterSlugs() {
    var SlugName = $('#SlugName').val().trim(); // Trim to remove extra spaces
    var UserID = $('#UserID').val();
    var SlugTypeID = $('#SlugTypeID').val();
    // Validate inputs
    if (!SlugName) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid Tag Name.',
            footer: ''
        });
        return;
    }
    // Create payload
    var modal = JSON.stringify({
        SlugName: SlugName,
        UserID: UserID,
        TypeID: SlugTypeID
    });

    // API Call
    new APICALL(GetGlobalURL('Base', 'SaveSlugs'), 'POST', modal, true).FETCH((result, error) => {
        if (result) {
            GetNewsSlugs();
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'News Slugs saved successfully!',
                footer: ''
            });

            // Optionally clear the input field after saving
            $('#SlugName').val('');
            $('#SlugTypeID').val('');
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
function Deleteslugs(SlugID) {
    var modalupdate = JSON.stringify({
        SlugID: SlugID
    });

    Swal.fire({
        title: 'Do you want to Delete the Slugs?',
        showDenyButton: true,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('RolesMasterDiv');

            new APICALL(GetGlobalURL('Base', 'DeleteSlugs'), 'POST', modalupdate, true).FETCH((result, error) => {
                HideLoader('RolesMasterDiv'); // Always hide loader

                if (result) {
                    GetNewsSlugs();
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