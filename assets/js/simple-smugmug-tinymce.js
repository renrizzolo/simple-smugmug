// not actually a tinymce plugin
jQuery(function($) {

    var select = $('.smugmug-albums select');
    var modal = $('#insert-smugmug-modal');

    $(document).ready(function(){
        $('#insert-smugmug-gallery').click(open_modal);
        $('#smugmug-modal-cancel').click(cancel_modal);
        $('#smugmug-modal-submit').click(submit_modal);
        $('#show_album_title').click(check);
        $('#show_gallery_buy_link').click(check);
        $('#display_in_lightgallery').click(check);
        $('#smugmug-enter-manually').click(show_manual);
        $('#smugmug-show-options').click(show_options);
    });
    function check() {
      $(this).val(this.checked ? 1 : 0);
    }

    function show_manual() {
        $('.smugmug-id-container').toggleClass('smugmug-show');
        select.prop('disabled', function(i, v) { return !v; });
    }

    function show_options() {
        $('.smugmug-options-container').toggleClass('smugmug-show');
        $(this).text() === 'Show options' ? $(this).text('Hide options') : $(this).text('Show options');
    }

    function open_modal() {
        if ( typeof latestAlbums === "undefined" ) {
            getLatestAlbums().success( function(data) {
                var latestAlbums = data.Response.Album;
                var options = '';
                $.each(latestAlbums, function(i, album){
                    options +='<option value='+album.AlbumKey+'>'+album.Name+'</option>';
                });
                select.html(options);
            }).error( function(err){
                console.log(err);
                $('.smugmug-albums span').text(err.Message);
            });
        }
        modal.toggleClass('smugmug-show');
    }

    function getLatestAlbums() {
        var apiKey = getVal('api_key');
        var smugmug_username = getVal('smugmug_username');
        var req = 'https://www.smugmug.com/api/v2/user/'+smugmug_username+'!albums?APIKey='+apiKey;

        return $.ajax({
            url: req,
            method: "GET",
            cache: true,
            dataType: "json",
            // success: function(data) {
            //     var latestAlbums = data;
            // },
            // error: function(xhr, status, error) {
            //   renderError(JSON.parse(xhr.responseText).Message);
            // }
        })
    }

    function cancel_modal() {
        modal.removeClass('smugmug-show');
    }

    function submit_modal() {
        var attributes = [];

        wp.media.editor.insert('[simple_smugmug '+mapAttributes()+']');
        modal.removeClass('smugmug-show');

    }

    function mapAttributes() {
        var string = '';
        if ( select.prop('disabled') ) {
            string += getAttribute('gallery_id');
        } else {
            string += getAttribute('gallery_id_select');
        }
        string += getAttribute('show_album_title');
        string += getAttribute('display_in_lightgallery');
        string += getAttribute('show_gallery_buy_link');
        string += getAttribute('image_count');
        string += getAttribute('album_container_class');
        string += getAttribute('first_image_container_class');
        string += getAttribute('image_container_class');
        string += getAttribute('image_class');
        string += getAttribute('title_class');
        string += getAttribute('link_class');
        string += getAttribute('smug_link_icon');

        return string;
    }

    function getVal(el){
        console.log('val ', $("*[name='simple_smugmug["+el+"]']").val());
        var val = $("*[name='simple_smugmug["+el+"]']").val();
        return val ? val.toString() : '';

    }

    function getData(el){
        console.log('data-current', $("*[name='simple_smugmug["+el+"]']").data('current') );
        var data = $("*[name='simple_smugmug["+el+"]']").data('current');
        return data ? data.toString() : '';

    }

    function getAttribute(el){
        var val = getVal(el);
        var data = getData(el);
        if (el === 'gallery_id_select'){
            el = 'gallery_id';
        }
        if ( val !== data || !data ) {
            return el+'="'+ val + '" ';
        } else {
            return '';
        }
    }
});
