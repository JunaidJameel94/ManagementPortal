var FeedLink  = {};
$(document).ready(function () {
    GetFeedLink();
    GetRSSFormat();
    $("#FeedLinkmasterform").validate();
    $('#SaveBtn').on('click', function () {
        SaveFeedLink();
    });
    $('#UpdateBtn').on('click', function () {
        UpdateFeedLink();
    });
    $('#ClearBtn').on('click', function () {
        DoClear();
    });
    $('#CloseModalBtn').on('click', function () {
        CloseModal();
    });

});

function GetRSSFormat() {
    new APICALL(GetGlobalURL('Base', 'GetFeedFormat'), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null) {
                $.each(result.data, function (i, option) {
                    $('#FormatNameID').append(
                        '<option value="' + option.FID + '" required>' + option.FormatName + '</option>'
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

function GetFeedLink() {
    ShowLoader('FeedLinkMasterDiv');
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'SelectFeedUrl'), 'GET', '', true).FETCH((result, error) => {
                if (result) {
                    $("#FeedLink-master").dataTable().fnDestroy();
                    $('#FeedLink-master tbody').html('');

                    if (result.data != null) {
                        FeedLink = result.data; // Assuming result.data is an array of feed objects

                        $.each(FeedLink, function (i, option) {
                            var UpdateBtn = (data_[0].AllowUpdate == true) ? '<td><button class="btn btn-sm btn-info EditFeedLink" data-value="' + option.ID + '" type="button"><i class="feather-edit-3"></i></button></td>' : '';
                            var DeleteBtn = (data_[0].AllowDelete == true) ? '<td><button class="btn btn-sm btn-danger DeleteFeedLink" data-value="' + option.ID + '" type="button"><i class="feather-trash"></i></button></td>' : '';

                            $('#FeedLink-master tbody').append(
                                '<tr id="rowid-' + i + '">' +
                                '<td>' + option.feed_name + '</td>' +
                                    '<td><a href="' + option.FeedURL + '">' + option.FeedURL + '</a></td>' +
                                '<td>' + (option.FormatName != null ? option.FormatName : '-') + '</td>' +


                                '<td>' + (option.IsActive == "0" ? 'Not Active' : 'Active') + '</td>' +
                                UpdateBtn +
                                DeleteBtn +
                                '</tr>'
                            );
                        });

                        $('.EditFeedLink').on('click', function () {
                            EditFeedLink(this.getAttribute("data-value"));
                        });

                        $('.DeleteFeedLink').on('click', function () {
                            DeleteFeedLink(this.getAttribute("data-value"));
                        });
                    }

                    $('#FeedLink-master').DataTable();
                    HideLoader('FeedLinkMasterDiv');
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


function EditFeedLink(ID) {
    new APICALL(GetGlobalURL('Base', 'GetRssFeedURL?Feed_ID=' + ID), 'GET', '', true).FETCH((result, error) => {
        if (result) {
            if (result.data != null && result.data.length > 0) {
                const feed = result.data[0];
                // Set the value after the dropdown is populated
                $('#FormatNameID').val(feed.Format_ID); // Ensure the value exists in the dropdown
                $('#ID').val(feed.ID);
                $('#feed_name').val(feed.feed_name);
                $('#FeedURL').val(feed.FeedURL);

                $('#IsActive').prop('checked', feed.IsActive);

                if ($('.updatebutton').hasClass('d-none')) {
                    $('.savebutton').toggleClass('d-none');
                    $('.updatebutton').toggleClass('d-none');
                }
            }
        }
    });
}

function SaveFeedLink() {

    if (!$('#FeedLinkmasterform').valid()) {
        return false;
    }

    var feed_name = $('#feed_name').val();
    var FeedURL = $('#FeedURL').val();
    var IsActive = $('#IsActive').val();
    var FormatNameID = $('#FormatNameID').val();
    var Model = JSON.stringify({
        feed_name: feed_name,
        FeedURL: FeedURL,
        IsActive: IsActive,
        FormatID: FormatNameID
    });

    Swal.fire({
        title: 'Do you want to save?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('CountriesDiv');
            new APICALL(GetGlobalURL('Base', 'insert_feed_url'), 'POST', Model, true).FETCH((result, error) => {
                if (result) {

                    GetFeedLink();


                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Feed Link Save Successfully!',
                        footer: ''
                    });

                    HideLoader('CountriesDiv');
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

function UpdateFeedLink() {
    if (!$('#FeedLinkmasterform').valid()) {
        return false;
    }

    var FeedlinkID = $('#ID').val();
    var feed_name = $('#feed_name').val();
    var FeedURL = $('#FeedURL').val();
    var IsActive = $('#IsActive').val();
    var FormatNameID = $('#FormatNameID').val();
    var Model = JSON.stringify({
        ID: FeedlinkID,
        feed_name: feed_name,
        FeedURL: FeedURL,
        IsActive: IsActive,
        FormatID: FormatNameID

    });

    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('FeedLinkMasterDiv');
            new APICALL(GetGlobalURL('Base', 'update_feed_url'), 'POST', Model, true).FETCH((result, error) => {

                if (result) {
                    GetFeedLink();
                    //DoEmptyFields();


                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Feed Link Updated Successfully!',
                        footer: ''
                    });
                }
                if (error) {

                    Swal.fire({
                        icon: 'error',
                        title: 'Error...',
                        text: error.data.responseText,
                        footer: ''
                    });
                }
                HideLoader('FeedLinkMasterDiv');
            });
        }
    });
}

function DeleteFeedLink(ID) {

    var DeleteData = JSON.stringify({
        ID: ID
    });
    Swal.fire({
        title: 'Do you want to save the changes?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            ShowLoader('FeedLinkMasterDiv');
            new APICALL(GetGlobalURL('Base', 'delete_feed_url'), 'POST', DeleteData, true).FETCH((result, error) => {

                if (result) {
                    GetFeedLink();

                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Feed Link Deleted Successfully!',
                        footer: ''
                    });

                    HideLoader('FeedLinkMasterDiv');
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
