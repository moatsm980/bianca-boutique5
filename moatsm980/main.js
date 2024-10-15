$(document).ready(function () {

    // Toggle Navbar-Color-On-Scroll
    // $(window).scroll( function () {
    //     var windowTop = $(window).scrollTop();
    //     var navbar = $('#navbar-wrapper');
    //     if(windowTop > 100) {
    //         navbar.addClass('nav-bg-color shadow');
    //     } else {
    //         navbar.removeClass('nav-bg-color shadow');
    //     }
	// });

    var fixed = document.getElementById('navbar-wrapper');
    fixed.addEventListener('touchmove', function(e) {
        e.preventDefault();
    }, false);

    /*** multi-level navigation drop-down ***/
    $('.dropdown-menu a.dropdown-toggle').on('click', function (e) {
        if (!$(this).next().hasClass('show')) {
            $(this).parents('.dropdown-menu').first().find('.show').removeClass("show");
        }
        var $subMenu = $(this).next(".dropdown-menu");
        $subMenu.toggleClass('show');

        $(this).parents('li.nav-item.dropdown.show').on('hidden.bs.dropdown', function (e) {
            $('.dropdown-submenu .show').removeClass("show");
        });

        return false;
    });

    /*** load video thumb image ***/
    $('.vid-thumb').each(function (index, value) {
        var url = $(this).attr('data-video-url');
        var videoId = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
        if (videoId != null) {
            $(this).attr('src', 'https://img.youtube.com/vi/' + videoId[1] + '/hqdefault.jpg');
        }
    });

    /*** video thumbnail script ***/
    $(function () {
        $('.update-data').each(function (index, value) {
            var urls = findYoutubeUrls($(this).val());
            var id = $(this).data('id');

            if (urls.length !== 0) {
                var imgUrl = 'https://img.youtube.com/vi/' + urls[0][1].slice(0, 11) + '/hqdefault.jpg';

                $('#update-video-wrap-' + id).removeClass('d-none');
                $('#update-video-thumb-' + id).attr('src', imgUrl);
                $('#update-video-zoom-link-'+ id).attr('href', imgUrl);

                // HomePage VideoUpdate
                $('#update-vid-image-'+ id).attr('src', imgUrl);

            } else {
                $('#uc-vid-'+ id).addClass('video-update');
                $('#update-no-video-image-'+id).addClass('d-none');
                $('#update-vid-image-'+ id).addClass('d-none');
            }
        });
    });

    function findYoutubeUrls(text) {
        var source = (text || '').toString();
        var urlArray = [];
        var url;
        var matchArray;

        var regexToken = /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/g;

        while ((matchArray = regexToken.exec(source)) !== null) {
            var token = matchArray;
            urlArray.push(token);
        }

        return urlArray;
    }

    // Report Website Form Submit
    // report Open Button Clicked
    $('#report-btn').click(function () {
        $('#report-box').addClass('open');
    });

    // report Close Button Clicked
    $('#report-close-btn').click(function () {
        $('#report-box').toggleClass('open');
    });

    $('input[type=radio][name=report-reason]').change(function() {
        if ( $(this).val() == 'none' ) {
            $('#extra-field').css('display', 'block');
            $('#extra-field input[type=text]').attr('required', 'required');
        } else {
            $('#extra-field').css('display', 'none');
            $('#extra-field input[type=text]').removeAttr('required');
        }
    });

    // report Form Submit
    $("#report-form").submit(function (e) {
        e.preventDefault();

        $('.report-send-btn').css('opacity', '0.6');
        $('.report-send-btn').html('Sending..');

        $('#confirmation-box').toggleClass('show');
    });

    // Confimation Box Actions
    $('#cancel-report-abuse').click(function() {
        $('.report-send-btn').css('opacity', '1');
        $('.report-send-btn').html('SEND');
        $('#confirmation-box').removeClass('show');
    });

    $('#confirm-report-abuse').click(function() {
        // Send Data
        $('#confirmation-box').removeClass('show');
        sendReportAbuse();
    });

    // Submit Function For Report Abuse
    function sendReportAbuse() {
        var formData = $('#report-form').serializeArray();        
        var dataObj = {};
        var tempdataObj = {};
        $(formData).each(function (i, field) {
            if(field.name == "report-reason" &&  field.value == "none") {
                tempdataObj[field.name] = '[Other]';
            } else {
                tempdataObj[field.name] = field.value;
            }
        });
        dataObj['_token'] = tempdataObj['_token'];
        dataObj['website_id'] = tempdataObj['report-website_id'];
        dataObj['msg_title'] = tempdataObj['msg_title'];
        dataObj['feedback_msg'] = 'Visitors email: '+tempdataObj['report-email']+'\n Report Reason: '+tempdataObj['report-reason']+'\n'+tempdataObj['report-custom-reason']+'\n website url: '+tempdataObj['report-website_url']+'\n\n Report Message: '+tempdataObj['report-msg'];

        $("#report-form :input").prop("disabled", true);

        $.ajax({
            method: "post",
            url: "/feedback/send_web_msg",
            data: dataObj,
            success: function (response) {
                $("#report-form :input").prop("disabled", false);
                $('#confirmation-box').removeClass('show');
                $("#report-success-box").addClass('show');

                setTimeout(function() {
                    $("#report-success-box").removeClass('show');
                    $('#report-box').removeClass('open');
                    $('#report-form')[0].reset();

                    $('.report-send-btn').css('opacity', '1');
                    $('.report-send-btn').html('SEND');
                    $('#report-form textarea').val('');
                }, 8000);
            },
            error: function (response) {
                console.error('error', response);
                $("#report-form :input").prop("disabled", false);

                $('.report-send-btn').css('opacity', '1');
                $('#report-form textarea').val('');

                $('#report-box').removeClass('open');
            }
        });
    }

    // Search-Modal action button script
    function slug(str) {
        var $slug = '';
        var trimmed = $.trim(str);
        $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        return $slug.toLowerCase();
    }

    $(function () {
        $('#btn-search').click(function () {
            var query = slug($('#search-form #query').val());
            var type = $('#search-form input[name=type]:checked').val();
            window.location.href = '/search/' + type + '/' + query;
        });

        $('#search-form #query').keyup(function (event) {
            if (event.keyCode === 13) {
                $('#btn-search').click();
            }
        });
    });

    //News letter script
    $("#subscribe").on('click', function () {
        var email = $("#subscriber-email").val();

        $('#subscriber-email').prop('disabled', true);

        $('#subscriber_loader').removeClass('hide').addClass('show');
        $('#subscriber_send').removeClass('show').addClass('hide');

        $.ajax({
            method: "get",
            url: "/subscribeToBusiness",
            data: {
                businessdetails_id: $("#businessdetails_id").val(),
                website_id: $("#website_id").val(),
                email: email,
            },
            success: function (response) {

                $('#subscriber-email').prop('disabled', false);
                $("#subscriber-email").val('');

                $('#subscriber-response').removeClass('hide').removeClass('alert-danger').addClass('show');
                $('#subscriber-response').html(response).addClass('alert-success');

                setTimeout(function () {
                    $('#subscriber-response').removeClass('show').addClass('hide');
                }, 6000);

                $('#subscriber_send').removeClass('hide').addClass('show');
                $('#subscriber_loader').removeClass('show').addClass('hide');

            },
            error: function (response) {
                var errData = $.parseJSON(response.responseText);
                var msg = 'Error Subscribing to business. Please try again later.';

                $('#subscriber-email').prop('disabled', false);
                $.each(errData, function (index, val) {
                    msg = val[0];
                });

                $('#subscriber-response').removeClass('hide').addClass('show');
                $('#subscriber-response').html(msg).addClass('alert-danger');

                setTimeout(function () {
                    $('#subscriber-response').removeClass('show').addClass('hide');
                }, 6000);

                $('#subscriber_send').removeClass('hide').addClass('show');
                $('#subscriber_loader').removeClass('show').addClass('hide');
            }
        })
    });

    // Contact From Script
    $("#sendMessageForm").submit(function (e) {

        e.preventDefault();
        var formData = $('#sendMessageForm').serializeArray();
        var dataObj = {};

        $(formData).each(function (i, field) {
            dataObj[field.name] = field.value;
        });

        $("#sendMessageForm :input").prop("disabled", true);

        $('#inquiry_loader').removeClass('hide').addClass('show');
        $('#inquiry_send').removeClass('show').addClass('hide');

        $.ajax({
            method: "post",
            url: "/sendMessage",
            data: dataObj,
            success: function (response) {
                if (response['success'] == 1) {

                    $('#sendMessageForm-response').removeClass('hide').removeClass('alert-danger').addClass('show');
                    $('#sendMessageForm-response').text(response['msg']).addClass('alert-success');
                    // $('#sendMessageForm-response').text(response['msg']);

                    $('#sendMessageForm .input-reset').val('');
                    $('#phonecode').val('').trigger('change');

                    $('#inquiry_send').removeClass('hide').addClass('show');
                    $('#inquiry_loader').removeClass('show').addClass('hide');

                    grecaptcha.reset($('#sendMessageForm .recaptcha-scale').data('grecapid'));
                }
                else {

                    $('#sendMessageForm-response').removeClass('hide').addClass('show');
                    $('#sendMessageForm-response').text(response['msg']).addClass('alert-danger');
                    // $('#sendMessageForm-response').alert('close');

                    $('#inquiry_send').removeClass('hide').addClass('show');
                    $('#inquiry_loader').removeClass('show').addClass('hide');
                }
                setTimeout(function () {
                    $('#sendMessageForm-response').removeClass('show').addClass('hide');
                }, 6000);

                $("#sendMessageForm :input").prop("disabled", false);
            },
            error: function (response) {
                console.log('error' + response);
                $("#sendMessageForm :input").prop("disabled", false);
                $('#sendMessageForm-response').text(response['msg']);

                $('#inquiry_send').removeClass('hide').addClass('show');
                $('#inquiry_loader').removeClass('show').addClass('hide');
            }
        })

    });
    // phone code for navigation inquiry form
    $('#phonecode').select2({
        dropdownParent: $("#sendMessageForm"),
        minimumInputLength: 2,
        placeholder: "e.g.+91 (IN)",
        width: "resolve",
        ajax: {
            url: '/reg/fetch/phonecode',
            data: function (params) {
                var query = {
                    phoneCode: params.term
                }
                return query;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        }
    });

    // OrderFrom Script
    //set title, quantity and unit for product order form
    $('.orderModal').click(function () {

        $('#title-product-name').text($(this).data('name'));
        $('#product_id').val($(this).data('id'));
        $('#unit').val($(this).data('unit'));

        if ($(this).data('btn').trim() == "0") {
            $('#default-btn-value').text('Enquire Now');
            $('#title-product-btn-value').text('Enquiry For');
        } else {
            $('#default-btn-value').text($(this).data('btn'));
            $('#title-product-btn-value').text($(this).data('btn'));
        }

        $('#orderModal').modal('show');
    });

    // Order Form Script
    $("#placeOrder").on('click', function () {
        var formData = $('#orderForm').serializeArray();
        var dataObj = {};

        $(formData).each(function (i, field) {
            dataObj[field.name] = field.value;
        });

        $("#orderForm :input").prop("disabled", true);
        $('#placeorder_loader').removeClass('hide').addClass('show');
        $('#placeorder_send').removeClass('show').addClass('hide');

        $.ajax({
            method: "post",
            url: "/productOrder",
            data: dataObj,
            success: function (response) {
                if (response['success'] == 1) {

                    $('#placeorder-response').html(response['msg']).removeClass('alert-danger').addClass('alert-success');
                    $('#placeorder-response').removeClass('hide').addClass('show');
                    $('#quantity').val('1');

                    $('#orderForm .input-reset').val('');
                    $('#order_phonecode').val('').trigger('change');

                    grecaptcha.reset($('#orderForm .recaptcha-scale').data('grecapid'));
                }
                else {

                    grecaptcha.reset($('#orderForm .recaptcha-scale').data('grecapid'));

                    $('#placeorder-response').html(response['msg']).addClass('alert-danger');
                    $('#placeorder-response').removeClass('hide').addClass('show');
                }

                $("#orderForm :input").prop("disabled", false);
                $('#placeorder_loader').removeClass('show').addClass('hide');
                $('#placeorder_send').removeClass('hide').addClass('show');

                setTimeout(function () {
                    $('#placeorder-response').removeClass('show').addClass('hide');
                }, 6000);

            },
            error: function (response) {
                $('#placeorder-response').html(response['msg']);
                $('#placeorder-response').removeClass('hide').addClass('show');

                $("#orderForm :input").prop("disabled", false);
                $('#placeorder_loader').removeClass('show').addClass('hide');
                $('#placeorder_send').removeClass('hide').addClass('show');
            }
        })

    });
    //phone code for order form
    $('#order_phonecode').select2({
        dropdownParent: $("#orderForm"),
        minimumInputLength: 2,
        placeholder: " e.g. +91 (IN)",
        width: "resolve",
        ajax: {
            url: '/reg/fetch/phonecode',
            data: function (params) {
                var query = {
                    phoneCode: params.term
                }
                return query;
            },
            processResults: function (data) {
                return {
                    results: data
                };
            }
        }
    });

});