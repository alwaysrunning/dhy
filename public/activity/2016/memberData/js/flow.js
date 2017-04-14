/**
 * Created by Ray on 2016/1/19.
 */
var Flow=(function(){
    function Flow(list, config) {
        this.list = list;
        this.config = {
            time: 800
        };
        $.extend(this.config, config);
    }
    Flow.prototype = {
        constructor: Flow,
        startUp: function () {
            var self = this;
            var i = 0;
            var len = this.list.length;
            var fadeIn = function () {
                setTimeout(function () {
                    $(self.list[i]).css("opacity",1);
                    i++;
                    if (i < len) {
                        fadeIn();
                    }
                }, self.config.time)
            };
            len&&fadeIn();
        }
    };
    return Flow;
})();