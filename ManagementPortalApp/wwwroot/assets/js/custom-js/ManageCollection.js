$(document).ready(function () {


    GetCollectionName();
   //



    $('#btnSavecollection').click(function () {
        SaveCollectionName();
    });
    
    $('#CreateNewCollectionmodal').click(function () {
        $('#smodalon').modal('show');
        $('body').removeClass();
    });

})

function GetCollectionName() {
    UTILITY.CheckSession((data_) => {
        if (data_) {
            new APICALL(GetGlobalURL('Base', 'GetCollectionNameManageCollection'), 'GET', '', true).FETCH((result, error) => {
                if (result) {

                    if ($.fn.dataTable.isDataTable('#CollectionsTbl')) {
                        $('#CollectionsTbl').DataTable().destroy();
                    }

                    if (result.data != null) {
                        // Clear existing rows in tbody
                        $('#CollectionsTbl tbody').html('');


                        // Iterate over each collection and append a new row to tbody
                        $.each(result.data, function (i, collection) {
                            var DeleteCollection = (data_[0].AllowDelete == true) ?
                                '<button class="btn btn-sm btn-danger DeleteCollection" data-value="' + collection.Collection_id + '" data-userid="' + collection.UserID + '"><i class="fa fa-trash"></i></button>' : '';
                            var row = '<tr>' +
                                '<td><a href="../Feed/ViewSaveCollection?collectionId=' + collection.Collection_id + '" class="collectionid text-black" data-collection-id="' + collection.Collection_id + '">' + collection.Collection_name + '</a></td>' +
                                '<td>' +
                                DeleteCollection +
                                '</td>' +
                                '</tr>';
                            $('#CollectionsTbl tbody').append(row);
                        });



                        $('.DeleteCollection').on('click', function () {
                            var CollectionID = this.attributes["data-value"].value;
                            var UserID = this.attributes["data-userid"].value;
                            DeleteCollectionName(CollectionID, UserID);
                        });



                        $("#CollectionsTbl").DataTable();
                       

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
    });
}

function SaveCollectionName() {
    var collectionname = $('#Collection_name').val();
    var Model = JSON.stringify({
        Collection_name: collectionname,
    });

    Swal.fire({
        title: 'Do you want to save?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'SaveCollectionName'), 'POST', Model, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success...',
                        text: 'Collection Saved Successfully!',
                        footer: ''
                    }).then(() => {
                        // Hide the modal after success message
                        $('#smodalon').modal('hide');
                    });
                    ClearcollecitonData();
                    GetCollectionName();
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

function ClearcollecitonData() {
    $('#Collection_name').val('');
}

function DeleteCollectionName(CollectionID, UserID) {

    var DeleteData = JSON.stringify({
        CollectionID: CollectionID,
        UserID: UserID
    });

    Swal.fire({
        title: 'Do you want to delete this collection?',
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Ok',
        denyButtonText: 'Cancel',
    }).then((result) => {
        if (result.isConfirmed) {
            new APICALL(GetGlobalURL('Base', 'DeleteCollectionName'), 'POST', DeleteData, true).FETCH((result, error) => {
                if (result) {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Collection deleted successfully',
                        footer: ''
                    });
                   
                    GetCollectionName();
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
