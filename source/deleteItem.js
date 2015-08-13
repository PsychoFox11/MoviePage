'use strict';

function deleteItem(event) {
    event.preventDefault();
    if (confirm('This will permanently delete the item, are you sure?')) {

        var data = new FormData(this),
        url = '/delete',
        method = 'POST',
        itemId = $(this).attr('data-id');

        console.log('Deleting Item');

        data.append('_id', itemId);

        $.ajax({
            url: url,
            data: data,
            contentType: false,
            processData: false,
            method: method,
            success: function (data) {
                $.colorbox.close();
                console.log('deleted');
                $('#singleItemDiv').remove();
                $('#updatedSearch').removeClass('hidden');
                $('#searchDiv').removeClass('hidden');
                $('tr').has('td').has('a[data-id=' + itemId + ']').remove();
            }
        });
    }
}

module.exports = deleteItem;