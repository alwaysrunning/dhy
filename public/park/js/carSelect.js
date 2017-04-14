/**
 * Created by 沐沐 on 2015-12-31.
 */

var carSelect = function (opt) {
    var licenceCode = ['京', '津', '沪', '渝', '冀', '豫', '云', '辽', '黑', '湘', '皖', '鲁', '新', '苏', '浙',
        '赣', '鄂', '桂', '甘', '晋', '蒙', '陕', '吉', '闽', '贵', '粤', '青', '藏', '川', '宁', '琼'];
    var licenceLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

    var option = $.extend({}, {
        pages: [licenceCode, licenceLetter],
        pagesContents: [],
        defaultCode: '湘A',
        target: '.dailog-select'
    }, opt);

    var slideBox = $(option.target).find('.slide-box');
    var selectResult = [];
    var selectResultTime = [];
    var showOrHide = false;

    var itemTap = function (item, itemIndex, itemText) {
        selectResultTime.push(itemText);
        $(self).trigger('tap', item, itemIndex, itemText);

        if (option.pagesContents[itemIndex + 1]) {
            pageSwitch(itemIndex + 1);
        } else {
            selectResult = selectResultTime;
            reset();
            toggle();
            $(self).trigger('complete', result());
        }
        return self;
    };
    var pageSwitch = function (index) {
        $(option.pagesContents).each(function (current, page) {
            page.toggle(current === index);
        });
        return self;
    };
    var result = function (text) {
        if(typeof text === 'string'){
            selectResult = text.split('');
            return text;
        }else{
            return selectResult.join('');
        }
    };

    var init = function () {
        $(option.pages).each(function (itemsIndex, itemsArray) {
            var itemContent = $('<div class="dailog-content clearfix"></div>').toggle(itemsIndex === 0);
            $(itemsArray).each(function (itemIndex, itemText) {
                var item = $('<span class="car-letter">' + itemText + '</span>');
                item.on('click', function () {
                    itemTap(item, itemsIndex, itemText);
                });
                itemContent.append(item);
            });
            option.pagesContents.push(itemContent);
            slideBox.append(itemContent);
        });

        $(self).trigger('complete', result(option.defaultCode));
        return self;
    };
    var toggle = function () {
        showOrHide = !showOrHide;
        $(option.target).toggle(showOrHide);
        if(!showOrHide){
            reset();
        }
        return self;
    };

    var reset = function () {
        selectResultTime = [];
        pageSwitch(0);
    };

    var self = {
        init: init,
        result: result,
        toggle: toggle,
        reset: reset,
        defaultCode:function(defaultCode){
            if(defaultCode){
                option.defaultCode = defaultCode;
            }
            return this;
        },
        check:function(){
            return selectResult.length === option.pages.length;
        }
    };

    return self;
};

carSelect.decode = function(code){
    return code.substr(0,2);
};